import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

export const ClipsRouter = createTRPCRouter({
    getClipsByVideo:protectedProcedure.input(z.object({clip_id:z.string()}))
    .query(async({ctx,input})=>{
      const clip = await prisma.clip.findFirst({
        where:{
            id:input.clip_id,
            user_id:ctx.session.userId
        }
      })
       if(!clip) throw new TRPCError({code:"NOT_FOUND"})
       const clips = await prisma.video.findMany({
        where:{
            user_id:ctx.session.userId,
            clip_id:clip.id,
            type:"SERVER_GENERATED_CLIP"
        }    
    });
    return {clip,clips}
    }),
     getCLips: protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(10),
      cursor: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {

    const userId = ctx.session.userId;

    const clips = await prisma.clip.findMany({
      where: {
        user_id: userId, // SECURITY
    },
      orderBy: {
        created_at: "desc",
      },
      take: input.limit + 1,
      cursor: input.cursor
        ? { id: input.cursor }
        : undefined,
    });

    let nextCursor: string | undefined = undefined;

    if (clips.length > input.limit) {
      const nextItem = clips.pop();
      nextCursor = nextItem!.id;
    }

    return {
      clips,
      nextCursor,
    };
  }),
})