"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { VideoProcessingStatus } from "@/generated/prisma/enums"

export function useUpdateVideoStatusCache() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  return (id: string, status:VideoProcessingStatus) => {
    queryClient.setQueryData(
      trpc.video.getVideos.infiniteQueryKey({ limit: 10 }),
      (old: any) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            videos: page.videos.map((video: any) =>
              video.id === id
                ? { ...video, status }
                : video
            ),
          })),
        }
      }
    )
  }
}