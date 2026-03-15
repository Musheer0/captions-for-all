"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { Video } from "@/generated/prisma/client"

export function useAddVideoToCache() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  return (video: Video) => {
    queryClient.setQueryData(
      trpc.video.getVideos.infiniteQueryKey({ limit: 10 }),
      (old: any) => {
        if (!old) return old

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              videos: [video, ...old.pages[0].videos],
            },
            ...old.pages.slice(1),
          ],
        }
      }
    )
  }
}