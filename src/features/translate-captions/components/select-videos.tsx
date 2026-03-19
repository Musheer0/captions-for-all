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

const SelectVideo = () => {
  const {selectedVideos,addVideo,removeVideo} = useSelectedVideoStore()
  const {step,setStep} = useCaptionFlowStore()
  return (
    <>
     <div className="header w-full flex items-center gap-3 py-3 px-2">
            <p className='text-lg font-semibold'>Select Videos to add Caption</p>
          </div>
      <div className="select-video flex items-center flex-col w-full  gap-2">
        <div className="below  rounded-4xl  h-full w-full py-3 pt-5 px-4 overflow-y-auto">
          <VideoList
          onDeSelect={removeVideo}
          selectedVideos={selectedVideos} onSelect={addVideo}/>
        </div>
      </div>
     {selectedVideos.length>0
     &&

      <div className="fixed w-fit  py-3 h-fit bottom-10  left-1/2 -translate-x-1/2  bg-background flex items-center justify-between border rounded-full gap-4 px-4 pl-5 shadow-sm" >
        <p className='text-sm text-nowrap font-semibold'>
          {selectedVideos.length} videos selected
        </p>
        <Button 
        disabled={selectedVideos.length==0}
        onClick={()=>{setStep(CaptionStep.CAPTION_SETTINGS)}}
        size={"sm"}>
          
          <HugeiconsIcon
          icon={ArrowRight01Icon}
          />
        </Button>
      </div>
     }
    </>
  )
}

export default SelectVideo