"use client"
import { Button } from '@/components/ui/button'
import UploadVideo from '@/features/videos/components/upload-video-component'
import VideoList from '@/features/videos/components/video-list'
import { Video } from '@/generated/prisma/client'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React, { useState } from 'react'
import { useSelectedVideoStore } from '../stores/selected-videos-store'
import { CaptionStep, useCaptionFlowStore } from '../stores/caption-flow-store'
import ViewHeader from '@/components/view-header'
import UploadVideoDialog from '@/features/videos/components/upload-video-dialog'

const SelectVideo = () => {
  const {selectedVideos,addVideo,removeVideo} = useSelectedVideoStore()
  const {step,setStep} = useCaptionFlowStore()
  return (
    <div className='flex flex-col flex-1 sm:pt-20  max-w-6xl mx-auto'>
     <div className="header w-full sm:hidden py-3 flex items-center gap-3  px-2">
            <p className='text-lg font-semibold'>Select Videos to add Caption</p>
          </div>
        <ViewHeader title='Select Videos' hideSearch>
         <UploadVideoDialog>
          <Button className={"rounded-xl"}>Upload Video</Button>
         </UploadVideoDialog>
        </ViewHeader>
      <div className="select-video flex items-center flex-col w-full  gap-2">
        <div className="below  rounded-4xl  h-full w-full py-0   overflow-y-auto">
          <VideoList
          onDeSelect={removeVideo}
          selectedVideos={selectedVideos} onSelect={addVideo}/>
        </div>
      </div>
   {selectedVideos.length > 0 && (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
    <div className="flex items-center gap-2.5 rounded-full px-4 py-1.5 pr-1.5
      bg-zinc-900 border border-zinc-700 shadow-xl shadow-black/30
      dark:bg-white dark:border-zinc-200 dark:shadow-black/15">

      {/* Pulse dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 dark:bg-violet-600" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400 dark:bg-violet-600" />
      </span>

      {/* Count */}
      <p className="text-sm font-semibold text-zinc-100 dark:text-zinc-900 tabular-nums whitespace-nowrap">
        {selectedVideos.length} {selectedVideos.length === 1 ? 'video' : 'videos'} selected
      </p>

      {/* Divider */}
      <div className="h-4 w-px bg-zinc-700 dark:bg-zinc-300" />

      {/* Button */}
      <Button
        disabled={selectedVideos.length === 0}
        onClick={() => setStep(CaptionStep.CAPTION_SETTINGS)}
        className="rounded-full gap-1.5 px-4 text-sm font-semibold h-8
          bg-violet-600 hover:bg-violet-500 text-white border-0
          dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white"
        size="sm"
      >
        Continue
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
      </Button>

    </div>
  </div>
)}
    </div>
  )
}

export default SelectVideo