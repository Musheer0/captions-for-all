"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"

export function useRemoveVideoFromCache() {
  const queryClient = useQueryClient()
  const trpc = useTRPC()

  return (id: string) => {
    queryClient.setQueryData(
      trpc.video.getVideos.infiniteQueryKey({ limit: 10 }),
      (old: any) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            videos: page.videos.filter((video: any) => video.id !== id),
          })),
        }
      }
    )
  }
}