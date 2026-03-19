import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { ExtractCaptionsFromVideoSchema } from "../schemas";
import { getVideoById, getVideoCaptionByVideoIdLang } from "@/features/videos/actions";
import { modalClient } from "@/lib/modal-client";
import prisma from "@/lib/prisma";

export const extractCaptionsFromVideo = inngest.createFunction(
    {id:"extract-captions",},
    {event:"event/extract-captions"},
     async ({ event, step }) => {
    const {data,error} = ExtractCaptionsFromVideoSchema.safeParse(event.data)
    if(error) throw new NonRetriableError("invalid data")
    const video = await getVideoById(data.video_id);
    if(!video) throw new NonRetriableError("video not found")
    if(video.user_id!==data.user_id) throw new NonRetriableError("video doesn't belong to user")
    const existing_caption = await getVideoCaptionByVideoIdLang(video.id,video.lang)
  if(existing_caption) return {
    existing_caption:true
  }
    const result = await modalClient.POST("/extract-caption",{
    body:{
        video_id:video.id,
        video_key:video.object_key
    }});
    if(result.error){
      throw new Error(JSON.stringify(result.error))
    }
    if(result.response.ok){
     const data:{ result_key:string, language:string} = result.data as any;
     console.log(data)

     await prisma.caption.create({
      data:{
        user_id:video.user_id,
        video_id:video.id,
        object_key:data.result_key,
        lang:data.language,

      },
      select:{
        id:true
      },
     })
     await prisma.video.update({where:{id:video.id},data:{lang:data.language}})
     return {data}
    }

  },
)

