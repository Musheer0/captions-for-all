"use client"
import React from 'react'
import { CaptionStep, useCaptionFlowStore } from '../stores/caption-flow-store'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { useSelectedVideoStore } from '../stores/selected-videos-store'
import { useCaptionStore } from '../stores/caption-settings'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'

const AddCaptionButton = () => {
  const trpc = useTRPC()
  const { mutate, isPending, isError, error } = useMutation({
    ...trpc.captions.addCaptions.mutationOptions(),
    onSuccess: () => {
      toast.success('Captions added successfully!',{position:"top-center"})
    },
    onError: (err) => {
      toast.error(err?.message ?? 'Failed to add captions. Please try again.',{position:"top-center"})
    },
  })
  const { step } = useCaptionFlowStore()
  const { selectedVideos } = useSelectedVideoStore()
  const { burnin, languageCode } = useCaptionStore()

  const handleClick = () => {
    if (!selectedVideos[0]?.id) {
      toast.error('No video selected.')
      return
    }

    mutate({
      video_ids: selectedVideos.map((v)=>v.id),
      burn_type: burnin,
      language_code: languageCode,
    })
  }

  if (step === CaptionStep.CAPTION_SETTINGS)
    return (
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none">
        {/* Progressive blur layers */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(1px)',
            WebkitBackdropFilter: 'blur(1px)',
            maskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 40%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 40%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            maskImage: 'linear-gradient(to top, black 0%, black 15%, transparent 30%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 15%, transparent 30%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            maskImage: 'linear-gradient(to top, black 0%, black 10%, transparent 22%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 10%, transparent 22%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            maskImage: 'linear-gradient(to top, black 0%, black 5%, transparent 15%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 5%, transparent 15%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            maskImage: 'linear-gradient(to top, black 0%, transparent 8%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 8%)',
          }}
        />

        {/* Button sits above the blur layers */}
        <div className="relative pb-10 pt-16 translate-y-1/5 cursor-pointer pointer-events-auto">
          <Button
            onClick={handleClick}
            disabled={isPending || !selectedVideos[0]?.id}
            className="cursor-pointer"
            size="lg"
          >
            {isPending ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full inline-block" />
                Adding Captions…
              </>
            ) : (
              <>
                <HugeiconsIcon icon={PlusSignIcon} />
                Add Captions To Video
              </>
            )}
          </Button>
        </div>
      </div>
    )
}

export default AddCaptionButton