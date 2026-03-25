"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SubtitleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type BurnInType = "soft" | "hard"

type Option = {
  value: BurnInType
  icon: any
  title: string
  badge: string
  badgeColor: string
  description: string
}

const options: Option[] = [
  {
    value: "soft",
    icon: SubtitleIcon,
    title: "Soft Subtitles",
    badge: "Recommended",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    description: "Subtitles appear as a separate track. Viewers can turn them on or off anytime   like Netflix captions.",
  },
  {
    value: "hard",
    icon: SubtitleIcon,
    title: "Hard Subtitles",
    badge: "Permanent",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    description: "Subtitles are baked directly into the video. Always visible, great for social media reels & stories.",
  },
]

type Props = {
  value?: BurnInType
  onChange?: (value: BurnInType) => void
}

export function BurnInSelector({ value = "soft", onChange }: Props) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            className={cn(
              "w-full text-left flex items-start gap-4 rounded-xl border px-4 py-3.5 transition-all duration-150",
              isSelected
                ? "border-primary/60 bg-primary/5 shadow-sm"
                : "border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40"
            )}
          >
            {/* Radio dot */}
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150"
              style={{
                borderColor: isSelected ? "hsl(var(--primary))" : "hsl(var(--border))",
              }}
            >
              {isSelected && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </div>

            {/* Icon */}
            <div className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
              isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <HugeiconsIcon icon={opt.icon} className="h-4 w-4" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  "text-sm font-semibold transition-colors",
                  isSelected ? "text-foreground" : "text-foreground/80"
                )}>
                  {opt.title}
                </span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide", opt.badgeColor)}>
                  {opt.badge}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {opt.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}