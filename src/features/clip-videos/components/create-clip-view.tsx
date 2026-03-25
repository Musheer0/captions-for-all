"use client"
import { Button } from '@/components/ui/button'
import ViewHeader from '@/components/view-header'
import UploadVideoDialog from '@/features/videos/components/upload-video-dialog'
import { Upload01Icon, Scissor01Icon, LoaderPinwheel } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React, { useState } from 'react'
import NumberOfClipsInputPanel from './number-of-clips-input'
import ClipSelector from './clip-selector'
import { useCreateClipVideoStore } from '../clip-video-store'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const CreateClipView = () => {
  const {count,setCount,video} = useCreateClipVideoStore()
  const trpc = useTRPC()
  const {mutateAsync,isPending} = useMutation(trpc.video.clip_video.mutationOptions())
  const handleClick = async()=>{
    if(count==0 || !video) return
    await mutateAsync({video_id:video.id,clip_count:count},{
      onSuccess:()=>{
        toast.success("creating clips you will be emailed when completed",{position:"top-center"})
      },
      onError:()=>{
        toast.error("error generating clip",{position:"top-center"})
      }
    })
  }

  return (
    <div className="w-full flex overflow-y-auto flex-col flex-1 max-w-6xl mx-auto py-4 px-4 sm:pt-16 gap-0">

      {/* Header   visible at >sm */}
      <ViewHeader
        desc="Maximum 6 clips allowed   computing is not free"
        title="Create Clips"
        hideSearch
      >
        <UploadVideoDialog>
          <Button variant="outline" className="rounded-xl gap-2">
            <HugeiconsIcon icon={Upload01Icon} size={16} />
            Upload Video
          </Button>
        </UploadVideoDialog>
      </ViewHeader>

      <div className='w-full flex-1 overflow-y-auto '>
          {/* Step 1: clip count */}
      <NumberOfClipsInputPanel value={count} onChange={setCount} />

      {/* Step 2: video selector */}
      <ClipSelector />
      </div>

      {/* Generate CTA   pinned at bottom on mobile */}
      <div className="sticky bottom-0 pt-6 pb-4  w-full  mt-6 ">
        <Button
        onClick={handleClick}
        disabled={count==0||!video||isPending}
          className="w-full rounded-xl h-11 text-sm font-medium gap-2"
        >
          <HugeiconsIcon 
          className={cn(isPending && 'animate-spin')}
          icon={isPending ? LoaderPinwheel:Scissor01Icon} size={16} />
          {isPending? "Generating":"Generate"} {count} {count=== 1 ? "Clip" : "Clips"}
        </Button>
      </div>
    </div>
  )
}

export default CreateClipView