"use client"
import React from 'react'
import { CaptionStep, useCaptionFlowStore } from '../stores/caption-flow-store'
import { useSelectedVideoStore } from '../stores/selected-videos-store'
import { useCaptionStore } from '../stores/caption-settings'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Tick01Icon, AlertCircleIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'

/**
 * Add to globals.css:
 *
 * @property --p { syntax: '<percentage>'; inherits: false; initial-value: 0%; }
 * @keyframes border-travel { 0% { --p: 0% } 100% { --p: 100% } }
 */

const AddCaptionButton = () => {
  const trpc = useTRPC()
  const { mutate, isPending, isError, isSuccess, reset } = useMutation({
    ...trpc.captions.addCaptions.mutationOptions(),
    onSuccess: () => {
      toast.success("Captions queued — you'll get an email when done!", { position: 'top-center' })
    },
    onError: (err) => {
      toast.error(err?.message ?? 'Failed to add captions. Please try again.', { position: 'top-center' })
    },
  })

  const { step } = useCaptionFlowStore()
  const { selectedVideos } = useSelectedVideoStore()
  const { burnin, languageCode } = useCaptionStore()
  const hasVideo = !!selectedVideos[0]?.id

  const handleClick = () => {
    if (isError)   { reset(); return }
    if (!hasVideo) { toast.error('Select a video first.', { position: 'top-center' }); return }
    mutate({ video_ids: selectedVideos.map((v) => v.id), burn_type: burnin, language_code: languageCode })
  }

  if (step !== CaptionStep.CAPTION_SETTINGS) return null

  const isNoVideo = !isPending && !isSuccess && !isError && !hasVideo
  const isIdle    = !isPending && !isSuccess && !isError &&  hasVideo

  // One travelling light streak — colour shifts per state
  // Kept deliberately subtle: the base is near-transparent, peak is ~85% opacity
  const ringVars = isSuccess
    ? { '--h': '142', '--s': '70%', '--l': '52%' } as React.CSSProperties
    : isError
    ? { '--h': '0',   '--s': '72%', '--l': '52%' } as React.CSSProperties
    : { '--h': '0',   '--s': '0%',  '--l': '80%' } as React.CSSProperties  // neutral white streak

  const ringBg = isNoVideo
    ? 'hsl(0 0% 50% / .1)'
    : `conic-gradient(
        from calc(var(--p) * 3.6deg),
        hsl(var(--h) var(--s) var(--l) / .07)  0%,
        hsl(var(--h) var(--s) var(--l) / .07) 44%,
        hsl(var(--h) var(--s) var(--l) / .5)  48%,
        hsl(var(--h) var(--s) 95%      / .85) 50%,
        hsl(var(--h) var(--s) var(--l) / .5)  52%,
        hsl(var(--h) var(--s) var(--l) / .07) 56%,
        hsl(var(--h) var(--s) var(--l) / .07) 100%
      )`

  const ringDuration = isPending ? '1.2s' : (isSuccess || isError) ? '2.5s' : '3s'

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

      <div className="relative pb-7 pt-14 pointer-events-auto">
        {/* ── Animated border ring ──────────────────────────────────── */}
        <div
          className="p-px rounded-[11px]"
          style={{
            ...ringVars,
            background: ringBg,
            ...(isNoVideo ? {} : {
              animationName: 'border-travel',
              animationDuration: ringDuration,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }),
          } as React.CSSProperties}
        >
          <button
            onClick={handleClick}
            disabled={isPending || isSuccess || isNoVideo}
            className={cn(
              'relative inline-flex items-center gap-2 px-[18px] h-10 rounded-[10px]',
              'text-[13.5px] font-medium tracking-[.01em] border-none outline-none',
              'transition-[background,transform] duration-[120ms] ease-out',
              'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring',

              isIdle && [
                'bg-foreground text-background',
                'hover:opacity-90 hover:-translate-y-px',
                'active:scale-[.97]',
              ],
              isNoVideo && 'bg-muted text-muted-foreground cursor-not-allowed',
              isPending && 'bg-foreground text-background opacity-50 cursor-not-allowed',
              isSuccess && [
                'bg-green-600 text-white',
                'hover:bg-green-700 hover:-translate-y-px active:scale-[.97]',
              ],
              isError && [
                'bg-destructive text-destructive-foreground',
                'hover:bg-destructive/85 hover:-translate-y-px active:scale-[.97]',
              ],
            )}
          >
            {isPending && <span className="w-[13px] h-[13px] rounded-full border-[1.5px] border-background/20 border-t-background/55 animate-spin flex-shrink-0"/>}
            {isSuccess  && <HugeiconsIcon icon={Tick01Icon}     size={14} className="flex-shrink-0"/>}
            {isError    && <HugeiconsIcon icon={AlertCircleIcon} size={14} className="flex-shrink-0"/>}
            {(isIdle || isNoVideo) && (
              <span className="w-[19px] h-[19px] rounded-full bg-background/[.13] flex items-center justify-center flex-shrink-0">
                <HugeiconsIcon icon={PlusSignIcon} size={9}/>
              </span>
            )}
            <span className="whitespace-nowrap">
              {isIdle    && 'Add captions to video'}
              {isNoVideo && 'Select a video first'}
              {isPending && 'Adding captions…'}
              {isSuccess && 'Captions queued!'}
              {isError   && 'Failed — tap to retry'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddCaptionButton