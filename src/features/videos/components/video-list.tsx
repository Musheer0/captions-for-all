"use client"
import React from "react"
import { useTRPC } from "@/trpc/client"
import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Video01Icon,
  Loading03Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { VideoCard } from "./video-card"
import UploadVideoDialog from "./upload-video-dialog"
import { Button } from "@/components/ui/button"
import { Video } from "@/generated/prisma/client"
import { toast } from "sonner"
interface VideoList {
  selectedVideos? :Video[],
  onSelect?:(data:Video)=>void,
  onDeSelect?:(id:string)=>void
}
const VideoList:React.FC<VideoList> = ({selectedVideos,onSelect,onDeSelect}) => {
  const trpc = useTRPC()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      trpc.video.getVideos.infiniteQueryOptions(
        { limit: 10 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    )
  var videos: Video[] =( data?.pages.flatMap((p) => p.videos) ?? [])
  videos = onSelect ? videos.filter((v)=>v.type!=="SERVER_GENERATED"): videos
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
        <UploadVideoDialog>
          <Button>Upload Video</Button>
        </UploadVideoDialog>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-fit p-2 gap-1.5">
  {videos.map((video) => (
  <div className="relative" key={video.id} >
    {onSelect &&
   <>
    <div
    onClick={()=>{
         if(video.status==="UPLOADING"){
        toast.error("video is still uploading please wait")
        return
      }
      if(!(selectedVideos  && onDeSelect))return
     if(selectedVideos?.some((v)=>v.id===video.id)){
      onDeSelect(video.id)
     }
     else onSelect(video)
    }}
    className={cn(
      "absolute w-full h-full rounded-2xl text-emerald-400 text-sm backdrop-blur-sm cursor-pointer pointer-events-auto hover:opacity-100 bg-emerald-600/10 opacity-0  flex items-center justify-center"
    )}>Select Video</div>
    {selectedVideos?.some((v)=>v.id===video.id) &&
     <div
    onClick={()=>{
       if(video.status==="UPLOADING"){
        toast.error("video is still uploading please wait")
        return
      }
      if(!(selectedVideos  && onDeSelect))return
     if(selectedVideos?.some((v)=>v.id===video.id)){
      onDeSelect(video.id)
     }
     else onSelect(video)
    }}
    className={cn(
      "absolute w-full h-full rounded-2xl text-red-400 text-sm backdrop-blur-sm cursor-pointer pointer-events-auto  bg-red-600/10   flex items-center justify-center"
    )}>Remove Video Video</div>
    }
   </>
    }
    <VideoCard key={video.id} video={video} />
  </div>
))}

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