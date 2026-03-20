import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { BurnCaptionToVideoSchema, ExtractCaptionsFromVideoSchema } from "../schemas";
import { getVideoById } from "@/features/videos/actions";
import { modalClient } from "@/lib/modal-client";
import prisma from "@/lib/prisma";

export const burnCaptionsToVideo = inngest.createFunction(
    {id:"soft-burn-captions",},
    {event:"event/soft-burn-captions"},
     async ({ event, step }) => {
    const {data,error} = BurnCaptionToVideoSchema.safeParse(event.data)
    console.log(data)
    if(error) throw new NonRetriableError("invalid data")
    const video = await getVideoById(data.video_id);
    console.log(video)
    if(!video) throw new NonRetriableError("video not found")
    if(video.user_id!==data.user_id) throw new NonRetriableError("video doesn't belong to user")
    const result = await modalClient.POST("/soft-burn-captions",{
    body:{
        video_id:video.id,
        video_key:video.object_key,
        caption_key:video.object_key+".json",
        lang_code:"en",
    }});
    if(result.error){
        console.log(result.error)
      throw new Error("eero")
    }
    if(result.response.ok){
     const data= result.data
     console.log(data)
     await prisma.video.create({
        data:{
            user_id:video.user_id,
            object_key:data.output_path,
            lang:data.lang,
            original_file_name:data.lang+"-"+video.original_file_name,
            size:video.size,
            status:"FINISHED_UPLOADING"
        }
     })
    //  await prisma.videoGeneration.create({
    //   data:{
    //     user_id:video.user_id,
    //     video_id:video.id,
    //     object_key:data.result_key,
    //     lang:data.language,


    //   },
    //   select:{
    //     id:true
    //   }
    //  })
     return {data}
    }

  },
)

