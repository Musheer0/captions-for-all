"use client"

import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Video01Icon,
  Download04Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { formatBytes } from "@/features/videos/utils/video"
import { LangBadge, StatusBadge } from "@/features/videos/components/video-badges"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { useRemoveVideoFromCache } from "../hooks/use-delete-video-from-cache"
import { Video } from "@/generated/prisma/client"



export const VideoCard = ({ video }: { video: Video }) => {
  const trpc = useTRPC()
  const deleteVideoCache = useRemoveVideoFromCache()

  const deleteVideoMutation = useMutation(
    trpc.video.deleteVideo.mutationOptions()
  )

  const isFailed = video.status.includes("FAILED")

  function handleDownload() {
    console.log("download", {
      id: video.id,
      file: video.original_file_name,
      key: video.object_key,
    })
  }

  async function handleDelete() {
    await deleteVideoMutation.mutateAsync({ videoId: video.id })
    deleteVideoCache(video.id)
  }

  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:bg-accent hover:border-border/80 transition-colors">
      
      {/* icon */}
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 border",
          isFailed
            ? "bg-destructive/10 border-destructive/20 text-destructive"
            : "bg-muted border-border text-muted-foreground"
        )}
      >
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

          {video.type==="SERVER_GENERATED"?<LangBadge lang={"Generated"} />:<LangBadge lang={"Uploaded"} />}
          <LangBadge lang={video.lang} />
          <StatusBadge status={video.status} />
        </div>
      </div>

      {/* actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDownload}
          disabled={isFailed}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <HugeiconsIcon icon={Download04Icon} size={15} />
        </button>

        {/* optional delete */}
        {/* 
        <button
          onClick={handleDelete}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <HugeiconsIcon icon={Delete02Icon} size={15} />
        </button> 
        */}
      </div>
    </div>
  )
}