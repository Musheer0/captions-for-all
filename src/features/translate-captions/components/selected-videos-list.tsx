"use client"
import React from 'react'
import { useSelectedVideoStore } from '../stores/selected-videos-store'
import { VideoProcessingStatus } from '@/generated/prisma/enums'
import { Video } from '@/generated/prisma/client'
import { useCaptionFlowStore } from '../stores/caption-flow-store'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft, VideoIcon } from '@hugeicons/core-free-icons'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { timeAgo } from '@/lib/utils'


// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}


function getStatusConfig(status: VideoProcessingStatus): {
  label: string
  className: string
  dotColor: string
} {
  const s = String(status).toLowerCase()
  if (s === 'finalized' || s === 'completed' || s === 'done') {
    return {
      label: 'Finalized',
      className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      dotColor: 'bg-emerald-400',
    }
  }
  if (s === 'processing' || s === 'pending') {
    return {
      label: s.charAt(0).toUpperCase() + s.slice(1),
      className: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      dotColor: 'bg-amber-400',
    }
  }
  if (s === 'failed' || s === 'error') {
    return {
      label: 'Failed',
      className: 'border-red-500/30 bg-red-500/10 text-red-400',
      dotColor: 'bg-red-400',
    }
  }
  return {
    label: s.charAt(0).toUpperCase() + s.slice(1),
    className: 'border-white/10 bg-white/5 text-white/40',
    dotColor: 'bg-white/30',
  }
}

// ─── SelectedVideoCard ────────────────────────────────────────────────────────
const SelectedVideoCard = ({ video }: { video: Video }) => {
  const { label, className, dotColor } = getStatusConfig(video.status)
  return (
    <Card className='shrink-0 bg-background/50 border min-w-[350px]'>
      
      <CardFooter className='flex relative flex-col items-start w-full'>
          
         <CardTitle>
          {video.original_file_name}
        </CardTitle>
        <CardDescription>
          {formatBytes(video.size)} &middot; {timeAgo(video.created_at)} &middot;   {video.lang}
        </CardDescription>

      </CardFooter>
    </Card>
  )
}

// ─── SelectedVideosList ───────────────────────────────────────────────────────
const SelectedVideosList = () => {
  const { selectedVideos } = useSelectedVideoStore()
  const {back} = useCaptionFlowStore()

  return (
    <div className="w-full border-b  pt-5 pb-3">
      <div className="mb-3  px-2 flex items-center gap-3 justify-between">
        <Button onClick={back} className={''}>
            <HugeiconsIcon
            icon={ArrowLeft}
            />
            Go Back
        </Button>
        <p className="text-[13px] mr-auto font-semibold uppercase tracking-wide text-white/60">
          Selected Videos
        </p>
        {selectedVideos.length > 0 && (
          <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-white/40">
            {selectedVideos.length}
          </span>
        )}
      </div>

      <div className="flex max-h-[40vh] w-full  gap-2 overflow-x-auto pr-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
        {  selectedVideos.map((video) => (
            <SelectedVideoCard video={video} key={video.id} />
          ))}
     
      </div>
    </div>
  )
}

export default SelectedVideosList