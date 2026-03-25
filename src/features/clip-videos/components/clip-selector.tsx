"use client"

import VideoList from '@/features/videos/components/video-list'
import { Video } from '@/generated/prisma/client'
import React, { useState } from 'react'
import { useCreateClipVideoStore } from '../clip-video-store'

const ClipSelector = () => {
  const {video,setVideo} = useCreateClipVideoStore()
  

  return (
    <div className="w-full flex flex-col overflow-y-auto gap-4">

      {/* Step label + heading */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Step 2 of 2
        </span>
        <div className="h-px w-12 bg-border" />
      </div>

      <div className="px-1 space-y-0.5">
        <p className="text-xl font-semibold">Select a source video</p>
        <p className="text-sm text-muted-foreground">
          Choose the video you want to clip from
        </p>
      </div>



      <VideoList
        selectedVideos={video ? [video] : []}
        onSelect={(s) =>setVideo(s)}
        onDeSelect={() =>setVideo(null)}
      />
    </div>
  )
}

export default ClipSelector