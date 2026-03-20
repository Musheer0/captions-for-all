import { AddCaptionsToVideoSchema } from "@/features/translate-captions/schema";
import { createTRPCRouter, protectedProcedure } from "../init";
import { getVideoById } from "@/features/videos/actions";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export const CaptionsRouter = createTRPCRouter({
    addCaptions:protectedProcedure.input(AddCaptionsToVideoSchema)
    .mutation(async({ctx,input})=>{
        console.log(input)
        const sendReq = async(id:string)=>{
            const video = await getVideoById(id)
        if(!video) throw new TRPCError({code:"NOT_FOUND"})
        if(video.user_id!==ctx.session.userId) throw new TRPCError({code:"UNAUTHORIZED"})
        await inngest.send({
        data:{...input,userId:ctx.session.userId,video_id:id},
        name:"event/burn-captions"
        })
        console.log('send')
        }
        await Promise.all(input.video_ids.map((id)=>sendReq(id)))
        return {success:true}
    })
})