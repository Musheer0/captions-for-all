"use client"
import React from "react"
import { useTRPC } from "@/trpc/client"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Video01Icon,
  Loading03Icon,
  ArrowDown01Icon,
  Tick02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { VideoCard } from "./video-card"
import UploadVideoDialog from "./upload-video-dialog"
import { Button } from "@/components/ui/button"
import { Video } from "@/generated/prisma/client"
import { toast } from "sonner"

interface VideoList {
  selectedVideos?: Video[]
  onSelect?: (data: Video) => void
  onDeSelect?: (id: string) => void
  generatedOnly?: boolean
}

const VideoList: React.FC<VideoList> = ({
  selectedVideos,
  onSelect,
  onDeSelect,
  generatedOnly,
}) => {
  const trpc = useTRPC()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      (
        generatedOnly
          ? trpc.video.getGeneratedVideos
          : trpc.video.getVideos
      ).infiniteQueryOptions(
        { limit: 10 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    )

  var videos: Video[] = data?.pages.flatMap((p) => p.videos) ?? []
  videos = onSelect ? videos.filter((v) => v.type !== "SERVER_GENERATED") : videos

  if (isLoading) {
    return (
      <div className="flex flex-col overflow-y-auto flex-1 items-center gap-2 py-16 text-muted-foreground">
        <HugeiconsIcon icon={Loading03Icon} size={24} className="animate-spin" />
        <span className="text-sm">Loading videos…</span>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted border border-border">
          <HugeiconsIcon icon={Video01Icon} size={22} />
        </div>
        <p className="text-sm">No videos yet</p>
        <UploadVideoDialog>
          <Button>Upload Video</Button>
        </UploadVideoDialog>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-fit p-2 gap-1.5">
      {videos.map((video) => {
        const isSelected = selectedVideos?.some((v) => v.id === video.id)

        const handleClick = () => {
          if (video.status === "UPLOADING") {
            toast.error("video is still uploading please wait")
            return
          }
          if (!(selectedVideos && onDeSelect)) return
          if (isSelected) {
            onDeSelect(video.id)
          } else {
            onSelect?.(video)
          }
        }

        return (
          <div className="relative group/item" key={video.id}>
            {onSelect && (
              <button
                onClick={handleClick}
                aria-label={isSelected ? "Remove video" : "Select video"}
                className={cn(
                  // Base
                  "absolute inset-0 z-10 w-full h-full rounded-2xl cursor-pointer",
                  "transition-all duration-200 ease-out",
                  // Layout
                  "flex items-end justify-between p-3",
                  // Default hover state (not selected)
                  !isSelected && [
                    "bg-gradient-to-t from-emerald-600/40 via-emerald-400/10 to-transparent",
                    "opacity-0 group-hover/item:opacity-100",
                  ],
                  // Selected state
                  isSelected && [
                    "bg-gradient-to-t backdrop-blur-[1px] from-emerald-950/60 via-emerald-900/20 to-transparent",
                    "ring-2 ring-emerald-500/70 ring-inset",
                    "opacity-100",
                  ]
                )}
              >
                {/* Select / Deselect label */}
                <span
                  className={cn(
                    "text-xs font-semibold tracking-wide px-2 py-1 rounded-lg backdrop-blur-sm transition-all duration-200",
                    isSelected
                      ? "text-red-300 bg-red-950/60"
                      : "text-white bg-black/40"
                  )}
                >
                  {isSelected ? "Remove" : "Select"}
                </span>

                {/* Check / X badge */}
                <span
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200",
                    isSelected
                      ? "bg-emerald-500 text-white scale-100"
                      : "bg-white/20 text-white/70 scale-90 group-hover/item:scale-100"
                  )}
                >
                  <HugeiconsIcon
                    icon={isSelected ? Tick02Icon : Cancel01Icon}
                    size={12}
                    strokeWidth={2.5}
                  />
                </span>
              </button>
            )}

            {/* Selection ring visible on card itself when selected */}
            <div
              className={cn(
                "rounded-2xl transition-all duration-200",
                isSelected && "ring-2 ring-emerald-500/50 ring-offset-1 ring-offset-background"
              )}
            >
              <VideoCard key={video.id} video={video} />
            </div>
          </div>
        )
      })}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-1 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-accent text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <HugeiconsIcon
            icon={isFetchingNextPage ? Loading03Icon : ArrowDown01Icon}
            size={14}
            className={cn(isFetchingNextPage && "animate-spin")}
          />
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  )
}

export default VideoList