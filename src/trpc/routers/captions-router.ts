import { AddCaptionsToVideoSchema } from "@/features/translate-captions/schema";
import { createTRPCRouter, protectedProcedure } from "../init";
import { getVideoById } from "@/features/videos/actions";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export const CaptionsRouter = createTRPCRouter({
    addCaptions:protectedProcedure.input(AddCaptionsToVideoSchema)
    .mutation(async({ctx,input})=>{
        const sendReq = async(id:string)=>{
            const video = await getVideoById(id)
        if(!video) throw new TRPCError({code:"NOT_FOUND"})
        if(video.user_id!==ctx.session.userId) throw new TRPCError({code:"UNAUTHORIZED"})
        await inngest.send({
        id:"burn-captions",
        data:{...input,userId:ctx.session.userId},
        name:"event/burn-captions"
        })
        }
        await Promise.all(input.video_ids.map((id)=>sendReq(id)))
        return {success:true}
    })
})