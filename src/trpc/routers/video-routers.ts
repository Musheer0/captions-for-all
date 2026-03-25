import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { generateObjectKey } from "@/lib/generate-object-key";
import { deleteObject, getS3UploadUrl, getSignedObjectUrl } from "@/lib/s3";
import z, { file } from "zod";
import { VideoProcessingStatus } from "@/generated/prisma/enums";
import { getUserEmail } from "@/lib/get-user-email";
import { inngest } from "@/inngest/client";
import { clipVideoRequest } from "@/features/clip-videos/schemas";

export const VideoRouters = createTRPCRouter({
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        file_name:z.string(),
        file_type:z.string(),
        file_size:z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.userId;
        const objectKey =generateObjectKey(userId)+input.file_name
        const video =  await prisma.video.create({
          data:{
            user_id: userId,
            object_key: objectKey,
            original_file_name: input.file_name,
            size:input.file_size,
          },
        })
        const signedUrl = await getS3UploadUrl(objectKey,input.file_type,input.file_size)

        return { signedUrl,video };
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
    getVideos: protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(10),
      cursor: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {

    const userId = ctx.session.userId;

    const videos = await prisma.video.findMany({
      where: {
        user_id: userId, // SECURITY
        type:"USER_UPLOADED"
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

    if (videos.length > input.limit) {
      const nextItem = videos.pop();
      nextCursor = nextItem!.id;
    }

    return {
      videos,
      nextCursor,
    };
  }),
  getGeneratedVideos: protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(50).default(10),
      cursor: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {

    const userId = ctx.session.userId;

    const videos = await prisma.video.findMany({
      where: {
        user_id: userId, // SECURITY
        type:"SERVER_GENERATED"
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

    if (videos.length > input.limit) {
      const nextItem = videos.pop();
      nextCursor = nextItem!.id;
    }

    return {
      videos,
      nextCursor,
    };
  }),
  getVideoById: protectedProcedure
  .input(
    z.object({
      videoId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {

    const video = await prisma.video.findFirst({
      where: {
        id: input.videoId,
        user_id: ctx.session.userId,
      },
    });

    if (!video) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Video not found",
      });
    }

    return video;
  }),
  deleteVideo: protectedProcedure
  .input(
    z.object({
      videoId: z.string(),
      dontremoves3:z.boolean().optional()
    })
  )
  .mutation(async ({ ctx, input }) => {

    const video = await prisma.video.findFirst({
      where: {
        id: input.videoId,
        user_id: ctx.session.userId,
      },
    });

    if (!video) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Video not found or not owned by user",
      });
    }

  
  if(!input.dontremoves3){
      console.log('s3')
    await deleteObject(video.object_key)
  }
      await prisma.video.delete({
      where: {
        id: video.id,
      },
    });
    return { success: true };
  }),
  update_uploadStatus:  protectedProcedure.input(
    z.object({
      videoId: z.string(),
      status:z.enum([
        "UPLOADING",
  "FINISHED_UPLOADING",
  "FAILED",
      ])
    })
  )
  .mutation(async ({ ctx, input }) => {

   await prisma.video.update({
    where:{id:input.videoId,user_id:ctx.session.userId},
    data:{
      status:input.status as VideoProcessingStatus
    }
   })
    return { success: true };
  }),
  downloadFile:protectedProcedure.input(z.object({id:z.string()}))
  .mutation(async({ctx,input})=>{
    const session = ctx.session
    const videoId = input.id
      if (!videoId) {
        throw new Error("Video ID required");
    }

    const video = await prisma.video.findFirst({
        where: {
            id: videoId,
            user_id: session.userId,
            status: "FINISHED_UPLOADING",
        },
    });

    if (!video) {
        throw new Error("Video not found or not yours");
    }

    const url = await getSignedObjectUrl(video.object_key,`${video.lang}-${video.original_file_name}`);

    return { url };
  }),
  clip_video :protectedProcedure
  .input(z.object({
    video_id:z.string(),
    clip_count:z.number().min(1).max(6).default(1)
  }))
  .mutation(async({ctx,input})=>{
    const userId= ctx.session.userId
    const userEmail = await getUserEmail(userId)
    const video = await prisma.video.findFirst({
      where:{
        id:input.video_id,
        user_id:userId,
        status:"FINISHED_UPLOADING"
      }
    });
    if(!video) throw new TRPCError({message:'video not found', code:"NOT_FOUND"})
    await inngest.send({
      name:"clip-video",
      data:{
        clip_count:input.clip_count,
        userId:userId,
        userEmail,
        video_id:video.id,
        video_key:video.object_key
      } as z.infer<typeof clipVideoRequest>
    })
  })
});