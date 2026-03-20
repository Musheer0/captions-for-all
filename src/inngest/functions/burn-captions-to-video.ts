import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { modalClient } from "@/lib/modal-client";
import prisma from "@/lib/prisma";
import { AddCaptionsToVideoInngestSchema } from "@/features/translate-captions/schema";
import { codes } from "@/constants/languages";
import { BurnType } from "@/generated/prisma/enums";
import { Caption, VideoGeneration } from "@/generated/prisma/client";

export const burnCaptionsToVideo = inngest.createFunction(
    {id:"burn-captions",retries:0},
    {event:"event/burn-captions"},
     async ({ event, step }) => {
      console.log('hi',event.data)
    const {data,error} = AddCaptionsToVideoInngestSchema.safeParse(event.data)
    if(error){
      throw new NonRetriableError(JSON.stringify(error))
    }
    // check if lan exits in supported langs arr
    if(!codes.includes(data.language_code)) throw new NonRetriableError("language not supported")
   
   
    // get video key
    const video = await prisma.video.findFirst({
      where:{
        id:data.video_id,
        user_id:data.userId
      }
    })
    const burnType = data.burn_type==="soft"?BurnType.SOFT : BurnType.HARD
    if(!video) throw new NonRetriableError("Video not found")
    var existingCaption:Caption|null = null

    // check for exiting generation or caption
    if(data.language_code==="og"){
      //check  if video is already exits
      const existingGeneratedVideo = await prisma.videoGeneration.findFirst({
          where:{
          user_id:data.userId,
          video_id:data.video_id,
          isOriginal:true,
          burn_type: data.burn_type==="soft"?BurnType.SOFT : BurnType.HARD
        }
      })
      if(existingGeneratedVideo){
        //TODO SEND EMAIL 
        return {
          cache:true,
          existingGeneratedVideo
        }
      }


      //check for existing caption
      existingCaption = await prisma.caption.findFirst({
        where:{
          user_id:data.userId,
          video_id:data.video_id,
          isOriginal:true
        }
      });
    }
    else{
    //check for existing generation
   const existingGeneratedVideo = await prisma.videoGeneration.findFirst({
          where:{
          user_id:data.userId,
          video_id:data.video_id,
          burn_type: data.burn_type==="soft"?BurnType.SOFT : BurnType.HARD,
          lang:data.language_code
        }
      })
      if(existingGeneratedVideo){
        //TODO SEND EMAIL 
        return {
          cache:true,
          existingGeneratedVideo
        }
      }

      //check for existing caption
      existingCaption = await prisma.caption.findFirst({
        where:{
          user_id:data.userId,
          video_id:data.video_id,
        }
      });
    }


    //just generate video if exiting caption
    if(existingCaption){
      const result = await step.run({id:"burn/video", name:"burn caption to video"},async()=>{
        const {data:response} = await modalClient.POST(data.burn_type==="soft"? "/soft-burn-captions":"/burn-captions",{
          body:{
            caption_key:existingCaption?.object_key!,
            lang_code:data.language_code,
            video_id:data.video_id,
            video_key:video.object_key
          }
        });
        if(!response) throw new NonRetriableError("internal server error")
        return response
      });
      if(result.cached){
        return result
      }
      const[ generation] = await prisma.$transaction([
        prisma.videoGeneration.create({
        data:{
          user_id:data.userId,
          object_key:result.output_path,
          burn_type:burnType,
          caption_id:existingCaption.id,
          video_id:video.id,
          lang:result.lang,
          isOriginal:data.language_code==="og"
        }
      }),
       prisma.video.create({
        data:{
          user_id:data.userId,
          object_key:result.output_path,
          lang:result.lang,
          type:"SERVER_GENERATED",
          original_file_name:video.original_file_name,
          size:video.size,
          status:"FINISHED_UPLOADING",
        }
      })
      ])
      return generation
    }

    //new generation
    const captionResponse = await step.run({id:"extract/captions", name:"extract captions"},async()=>{
      const {data} = await modalClient.POST("/extract-caption",{
        body:{
          video_id:video.id,
          video_key:video.object_key
        }
      });
      if(!data) throw new NonRetriableError("error generating captions")
       await prisma.video.update({
      where:{
        id:video.id
      },
      data:{
        lang:data.language
      }
      })
      return data
    });
    //save to db
    const generated_caption = await prisma.caption.create({
      data:{
        user_id:data.userId,
        object_key:captionResponse.result_key,
        lang:captionResponse.language,
        isOriginal:true,
        video_id:video.id,

      }
    });


    //new video generation
    const videoGenerationResponse = await step.run({id:"burn/video", name:"burn caption to video"},async()=>{
        const {data:response} = await modalClient.POST(data.burn_type==="soft"? "/soft-burn-captions":"/burn-captions",{
          body:{
            caption_key:generated_caption.object_key,
            lang_code:data.language_code,
            video_id:data.video_id,
            video_key:video.object_key
          }
        });
        if(!response) throw new NonRetriableError("internal server error")
        return response
      });
       if(videoGenerationResponse.cached){
        return videoGenerationResponse
      }
      //save to db
      const [generation] = await prisma.$transaction([ prisma.videoGeneration.create({
        data:{
          user_id:data.userId,
          object_key:videoGenerationResponse.output_path,
          burn_type:burnType,
          caption_id:generated_caption.id,
          video_id:video.id,
          lang:videoGenerationResponse.lang,
          isOriginal:data.language_code==="og"
        }
      }),
       prisma.video.create({
        data:{
          user_id:data.userId,
          object_key:videoGenerationResponse.output_path,
          lang:videoGenerationResponse.lang,
          type:"SERVER_GENERATED",
          original_file_name:video.original_file_name,
          size:video.size,
          status:"FINISHED_UPLOADING",
        },
        select:{id:true}
      })])
      return generation
  },
)

