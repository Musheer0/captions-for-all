import { clipVideoRequest } from "@/features/clip-videos/schemas";
import { inngest } from "../client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/prisma";
import { modalClient } from "@/lib/modal-client";
import { sendClipsFailedHtml, sendClipsReadyHtml, SendFailureVideoProccessHtml } from "@/lib/email-templates";
import { UploadType, VideoType } from "@/generated/prisma/enums";

export const clipVideo = inngest.createFunction(
      { id: "clip-video", retries: 0 },
  { event: "clip-video" },
  async({step,event})=>{
    const {data,error}  = clipVideoRequest.safeParse(event.data)
    if(error){
        throw new NonRetriableError(JSON.stringify(error))
    }

    //step 1 get captions
    var caption = await prisma.caption.findFirst({
      where:{
        video_id:data.video_id,
        isOriginal:true
      }
    });
    
    if(!caption){
      const response = await step.run({id:'extract-captions',name:'extract catpions'},
        async()=>{
          const res = await modalClient.POST("/extract-caption",{
            body:{
              video_id:data.video_id,
              video_key:data.video_key
            }
          });
          if(!res.data) {
             await inngest.send({
                        name: "event/send-email",
                        data: {
                          to: data.userEmail,
                          subject: "Error Clipping",
                          html:sendClipsFailedHtml(),
                        },
              });
              throw new NonRetriableError("error generating captions");
          }
          return res.data
        }
      )
      const new_caption = await prisma.caption.create({
        data:{
          video_id:data.video_id,
          user_id:data.userId,
          object_key:response.result_key,
          lang:response.language,
          isOriginal:true,
        }
      })
      caption = new_caption
    }

    //step 2 clip video 
    const clip_response = await step.run({id:"clip-video", name:"clip videos"},
      async()=>{
        const response = await modalClient.POST("/clip-video",{
          body:{
            caption_key:caption?.object_key!,
            clip_count:data.clip_count.toString(),
            user_id:data.userId,
            video_id:data.video_id,
            video_key:data.video_key
          }
        });
        
        if (!response.data){
            await inngest.send({
                        name: "event/send-email",
                        data: {
                          to: data.userEmail,
                          subject: "Error Clipping",
                          html: sendClipsFailedHtml(),
                        },
              });
              throw new NonRetriableError("error generating captions");
        }
        return response.data
      }
    )
    //save clips
     await prisma.video.createMany({
      data:clip_response.clips.map((c)=>{
        return{
        user_id:data.userId,
        object_key:c.path,
        type:UploadType.SERVER_GENERATED_CLIP,
         original_file_name:c.name,
        size:c.size
      }
      }),
    })
     await inngest.send({
          name: "event/send-email",
          data: {
            to: data.userEmail,
            subject: "Successfully Clipped Your Video ",
            html:sendClipsReadyHtml({videoId:data.video_id,userEmail:data.userEmail,clipCount:data.clip_count})
          },
        });
    
     
  }
)