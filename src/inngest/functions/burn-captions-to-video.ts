import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { modalClient } from "@/lib/modal-client";
import prisma from "@/lib/prisma";
import { AddCaptionsToVideoInngestSchema } from "@/features/translate-captions/schema";
import { codes, languages } from "@/constants/languages";
import { BurnType } from "@/generated/prisma/enums";
import { Caption } from "@/generated/prisma/client";
import { SendFailureVideoProccessHtml, sendSuccessfulVideoProcessedHtml } from "@/lib/email-templates";
import { getdownloadpage } from "@/lib/utils";

export const burnCaptionsToVideo = inngest.createFunction(
  { id: "burn-captions", retries: 0 },
  { event: "event/burn-captions" },
  async ({ event, step }) => {

    const { data, error } = AddCaptionsToVideoInngestSchema.safeParse(event.data);
    if (error) {
      throw new NonRetriableError(JSON.stringify(error));
    }

    if (!codes.includes(data.language_code)) {
      throw new NonRetriableError("language not supported");
    }

    const video = await prisma.video.findFirst({
      where: {
        id: data.video_id,
        user_id: data.userId,
      },
    });

    if (!video) {
      throw new NonRetriableError("Video not found");
    }

    const burnType =
      data.burn_type === "soft" ? BurnType.SOFT : BurnType.HARD;

    let existingCaption: Caption | null = null;

    if (data.language_code === "og") {

      const existingGeneratedVideo = await prisma.videoGeneration.findFirst({
        where: {
          user_id: data.userId,
          video_id: data.video_id,
          isOriginal: true,
          burn_type: burnType,
        },
      });

      if (existingGeneratedVideo) {
        await inngest.send({
          name: "event/send-email",
          data: {
            to: data.userEmail,
            subject: "Add captions for " + video.original_file_name,
            html: sendSuccessfulVideoProcessedHtml({
              downloadUrl: getdownloadpage(video.id),
              userEmail: data.userEmail,
              language:
                languages.find((l) => l.code === video.lang)?.language ||
                video.lang,
            }),
          },
        });

        return {
          cache: true,
          existingGeneratedVideo,
        };
      }

      existingCaption = await prisma.caption.findFirst({
        where: {
          user_id: data.userId,
          video_id: data.video_id,
          isOriginal: true,
        },
      });

    } else {

      const existingGeneratedVideo = await prisma.videoGeneration.findFirst({
        where: {
          user_id: data.userId,
          video_id: data.video_id,
          burn_type: burnType,
          lang: data.language_code,
        },
      });

      if (existingGeneratedVideo) {
        await inngest.send({
          name: "event/send-email",
          data: {
            to: data.userEmail,
            subject: "Already captions for " + video.original_file_name,
            html: sendSuccessfulVideoProcessedHtml({
              downloadUrl: getdownloadpage(existingGeneratedVideo.video_id),
              userEmail: data.userEmail,
              language:
                languages.find((l) => l.code === existingGeneratedVideo.lang)?.language ||
                existingGeneratedVideo.lang,
            }),
          },
        });

        return {
          cache: true,
          existingGeneratedVideo,
        };
      }

      existingCaption = await prisma.caption.findFirst({
        where: {
          user_id: data.userId,
          video_id: data.video_id,
        },
      });
    }

    if (existingCaption) {
      const result = await step.run(
        { id: "burn/video", name: "burn caption to video" },
        async () => {
          const { data: response } = await modalClient.POST(
            data.burn_type === "soft"
              ? "/soft-burn-captions"
              : "/burn-captions",
            {
              body: {
                caption_key: existingCaption.object_key,
                lang_code: data.language_code,
                video_id: data.video_id,
                video_key: video.object_key,
              },
            }
          );

          if (!response) {
            await inngest.send({
              name: "event/send-email",
              data: {
                to: data.userEmail,
                subject: "Error adding captions for " + video.original_file_name,
                html: SendFailureVideoProccessHtml({
                  userEmail: data.userEmail,
                  language:
                    languages.find((l) => l.code === video.lang)?.language ||
                    video.lang,
                }),
              },
            });

            throw new NonRetriableError("internal server error");
          }

          return response;
        }
      );

      if (result.cached) {
        return result;
      }

     const { generation, newVideo: new_video } = await prisma.$transaction(async (tx) => {
  const newVideo = await tx.video.create({
    data: {
      user_id: data.userId,
      object_key: result.output_path,
      lang: result.lang,
      type: "SERVER_GENERATED",
      original_file_name: video.original_file_name,
      size: video.size,
      status: "FINISHED_UPLOADING",
    },
  });

  const generation = await tx.videoGeneration.create({
    data: {
      user_id: data.userId,
      object_key: result.output_path,
      burn_type: burnType,
      caption_id: existingCaption.id,
      video_id: newVideo.id, // ✅ THIS is the important fix
      lang: result.lang,
      isOriginal: data.language_code === "og",
    },
  });

  return { generation, newVideo };
});

      await inngest.send({
        name: "event/send-email",
        data: {
          to: data.userEmail,
          subject: "Added captions for " + video.original_file_name,
          html: sendSuccessfulVideoProcessedHtml({
            downloadUrl: getdownloadpage(new_video.id),
            userEmail: data.userEmail,
            language:
              languages.find((l) => l.code === result.lang)?.language ||
              result.lang,
          }),
        },
      });

      return generation;
    }

    const captionResponse = await step.run(
      { id: "extract/captions", name: "extract captions" },
      async () => {
        const { data: res } = await modalClient.POST("/extract-caption", {
          body: {
            video_id: video.id,
            video_key: video.object_key,
          },
        });

        if (!res) {
          await inngest.send({
            name: "event/send-email",
            data: {
              to: data.userEmail,
              subject: "Error Adding captions for " + video.original_file_name,
              html: SendFailureVideoProccessHtml({
                userEmail: data.userEmail,
                language: "unknown",
              }),
            },
          });

          throw new NonRetriableError("error generating captions");
        }

        await prisma.video.update({
          where: { id: video.id },
          data: { lang: res.language },
        });

        return res;
      }
    );

    const generated_caption = await prisma.caption.create({
      data: {
        user_id: data.userId,
        object_key: captionResponse.result_key,
        lang: captionResponse.language,
        isOriginal: true,
        video_id: video.id,
      },
    });

    const videoGenerationResponse = await step.run(
      { id: "burn/video", name: "burn caption to video" },
      async () => {
        const { data: response } = await modalClient.POST(
          data.burn_type === "soft"
            ? "/soft-burn-captions"
            : "/burn-captions",
          {
            body: {
              caption_key: generated_caption.object_key,
              lang_code: data.language_code,
              video_id: data.video_id,
              video_key: video.object_key,
            },
          }
        );

        if (!response) {
          await inngest.send({
            name: "event/send-email",
            data: {
              to: data.userEmail,
              subject: "Error Adding captions for " + video.original_file_name,
              html: SendFailureVideoProccessHtml({
                userEmail: data.userEmail,
                language: captionResponse.language,
              }),
            },
          });

          throw new NonRetriableError("internal server error");
        }

        return response;
      }
    );

    if (videoGenerationResponse.cached) {
      return videoGenerationResponse;
    }
   const { generation, newVideo: new_video } = await prisma.$transaction(async (tx) => {
  const newVideo = await tx.video.create({
    data: {
      user_id: data.userId,
          object_key: videoGenerationResponse.output_path,
          lang: videoGenerationResponse.lang,
          type: "SERVER_GENERATED",
          original_file_name: video.original_file_name,
          size: video.size,
          status: "FINISHED_UPLOADING",
    },
  });

  const generation = await tx.videoGeneration.create({
    data: {
      user_id: data.userId,
          object_key: videoGenerationResponse.output_path,
          burn_type: burnType,
          caption_id: generated_caption.id,
      video_id: newVideo.id, // ✅ THIS is the important fix
    lang: videoGenerationResponse.lang,
          isOriginal: data.language_code === "og",
    },
  });

  return { generation, newVideo };
});



    await inngest.send({
      name: "event/send-email",
      data: {
        to: data.userEmail,
        subject: "Add captions for " + video.original_file_name,
        html: sendSuccessfulVideoProcessedHtml({
          downloadUrl: getdownloadpage(new_video.id),
          userEmail: data.userEmail,
          language:
            languages.find((l) => l.code === new_video.lang)
              ?.language || new_video.lang,
        }),
      },
    });

    return generation;
  }
);