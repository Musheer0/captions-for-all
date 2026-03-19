"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Loading03Icon,
  ArrowUpIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { resolveStatus } from "@/features/videos/utils/video"

const iconMap = {
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Loading03Icon,
  ArrowUpIcon,
}

export function LangBadge({ lang }: { lang: string }) {
  return (
    <span className="font-mono text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/8 text-primary border border-primary/15">
      {lang}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const config = resolveStatus(status)
  const Icon = iconMap[config.icon as keyof typeof iconMap]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
        config.className
      )}
    >
      <HugeiconsIcon icon={Icon} size={11} />
      {config.label}
    </span>
  )
}