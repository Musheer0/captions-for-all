"use client"

import React from "react"
import { useTRPC } from "@/trpc/client"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Video01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Loading03Icon,
  ArrowUpIcon,
  Delete02Icon,
  Download04Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useRemoveVideoFromCache } from "../hooks/use-delete-video-from-cache"

// ── helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const statusConfig = {
  FINALIZED: {
    icon: CheckmarkCircle02Icon,
    label: "Finalized",
    className: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400",
  },
  UPLOADING: {
    icon: ArrowUpIcon,
    label: "Uploading",
    className: "bg-violet-500/10 text-violet-600 border border-violet-500/20 dark:text-violet-400",
    animate: "animate-bounce",
  },
  PROCESSING: {
    icon: Loading03Icon,
    label: "Processing",
    className: "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400",
    animate: "animate-spin",
  },
  FAILED: {
    icon: AlertCircleIcon,
    label: "Failed",
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
}

function resolveStatus(status: string) {
  if (status === "FINISHED_UPLOADING") return statusConfig.FINALIZED
  if (status.includes("FAILED")) return statusConfig.FAILED
  if (status === "PROCESSING") return statusConfig.PROCESSING
  return statusConfig.UPLOADING
}

// ── sub-components ────────────────────────────────────────────────────────────

function LangBadge({ lang }: { lang: string }) {
  return (
    <span className="font-mono text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/8 text-primary border border-primary/15">
      {lang}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = resolveStatus(status)
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full", config.className)}>
      <HugeiconsIcon icon={config.icon} size={11}  />
      {config.label}
    </span>
  )
}

// ── main component ────────────────────────────────────────────────────────────

type Video = {
  id: string
  original_file_name: string
  size: number
  lang: string
  status: string
  object_key: string
}

const VideoList = () => {
  const trpc = useTRPC()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      trpc.video.getVideos.infiniteQueryOptions(
        { limit: 10 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    )
    const deleteVideoMutation = useMutation(trpc.video.deleteVideo.mutationOptions())
    const deleteVideoCache = useRemoveVideoFromCache()
  const videos = data?.pages.flatMap((p) => p.videos) ?? []

  function handleDownload(video: Video) {
    console.log("download", { id: video.id, file: video.original_file_name, key: video.object_key })
  }

  async function handleDelete(video: Video) {
    await deleteVideoMutation.mutateAsync({videoId:video.id})
    deleteVideoCache(video.id)

  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
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
      </div>
    )
  }

  return (
    <div className="flex flex-col p-2 gap-1.5">
      {videos.map((video) => {
        const isFailed = video.status.includes("FAILED")
        return (
          <div
            key={video.id}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:bg-accent hover:border-border/80 transition-colors"
          >
            {/* icon */}
            <div className={cn(
              "flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 border",
              isFailed
                ? "bg-destructive/10 border-destructive/20 text-destructive"
                : "bg-muted border-border text-muted-foreground"
            )}>
              <HugeiconsIcon icon={Video01Icon} size={17} />
            </div>

            {/* info */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {video.original_file_name}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {formatBytes(video.size)}
                </span>
                <span className="text-border">·</span>
                <LangBadge lang={video.lang} />
                <StatusBadge status={video.status} />
              </div>
            </div>

            {/* actions — visible on hover */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDownload(video)}
                disabled={isFailed}
                title="Download"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <HugeiconsIcon icon={Download04Icon} size={15} />
              </button>
              {/* <button
                onClick={() => handleDelete(video)}
                title="Delete"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <HugeiconsIcon icon={Delete02Icon} size={15} />
              </button> */}
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