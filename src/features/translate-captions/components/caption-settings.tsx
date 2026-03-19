"use client"

import React, { useState, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  LanguageCircleIcon,
  EyeIcon,
  InformationCircleIcon,
  Alert01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { LanguageSelector } from "./select-language"
import { BurnInSelector } from "./burn-in-selector"
import { useCaptionStore } from "../stores/caption-settings"

type FieldError = {
  language?: string
  burnin?: string
}

const CaptionSettings = () => {
  const { languageCode, burnin, setLanguageCode, setBurnin } = useCaptionStore()
  const [errors, setErrors] = useState<FieldError>({})

  const clearError = (field: keyof FieldError) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }))

  const handleLanguageChange = useCallback(
    (value: string) => {
      clearError("language")
      try {
        setLanguageCode(value)
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          language: err instanceof Error ? err.message : "Invalid language selection.",
        }))
      }
    },
    [setLanguageCode]
  )

  const handleBurninChange = useCallback(
    (value: string) => {
      clearError("burnin")
      try {
        setBurnin(value)
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          burnin: err instanceof Error ? err.message : "Invalid subtitle style.",
        }))
      }
    },
    [setBurnin]
  )

  return (
    <div className="flex flex-col h-full mb-20 sm:mb-0 border-b flex-1 w-full min-h-0 overflow-y-auto">

      {/* ── Two-column grid on md+, single col on mobile ── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/40">

        {/* ═══ LEFT — Language ═══ */}
        <div className="flex flex-col gap-6 p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
              <HugeiconsIcon icon={LanguageCircleIcon} className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Caption Language</p>
              <p className="text-xs text-muted-foreground">What language for the subtitles?</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">How it works</p>
            <div className="space-y-2.5">
              {[
                { n: "1", text: "Pick the language you want captions in" },
                { n: "2", text: "We auto-translate & sync them to your video" },
                { n: "3", text: 'Choose "Original" to keep the spoken language' },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-bold text-blue-500">
                    {step.n}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-foreground">Selected language</label>
              {/* Live store value badge */}
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500 ring-1 ring-blue-500/20 tabular-nums">
                {languageCode.toUpperCase()}
              </span>
            </div>

            <LanguageSelector
              value={languageCode}
              onChange={handleLanguageChange}
            />

            {/* Language error */}
            {errors.language && (
              <div className="flex items-center gap-1.5 mt-1">
                <HugeiconsIcon icon={Alert01Icon} className="h-3.5 w-3.5 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">{errors.language}</p>
              </div>
            )}
          </div>

          {/* Translation notice — only when not on original */}
          {languageCode !== "og" && (
            <div className="flex items-start gap-2.5 rounded-xl bg-blue-500/8 border border-blue-500/20 px-3.5 py-3">
              <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
              <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                Captions will be translated and synced automatically — no extra steps needed.
              </p>
            </div>
          )}
        </div>

        {/* ═══ RIGHT — Burn-in ═══ */}
        <div className="flex flex-col gap-6 p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
              <HugeiconsIcon icon={EyeIcon} className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Subtitle Style</p>
              <p className="text-xs text-muted-foreground">Can viewers turn them off?</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Quick guide</p>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={cn(
                  "rounded-lg border p-3 space-y-1 transition-colors",
                  burnin === "soft"
                    ? "bg-emerald-500/12 border-emerald-500/40"
                    : "bg-emerald-500/8 border-emerald-500/20"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={EyeIcon} className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Soft</p>
                  {burnin === "soft" && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wide text-emerald-500">active</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Viewer can hide — like Netflix / YouTube</p>
              </div>

              <div
                className={cn(
                  "rounded-lg border p-3 space-y-1 transition-colors",
                  burnin === "hard"
                    ? "bg-orange-500/12 border-orange-500/40"
                    : "bg-orange-500/8 border-orange-500/20"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={EyeIcon} className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                  <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">Hard</p>
                  {burnin === "hard" && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wide text-orange-500">active</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Permanently added to video </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Choose a style</label>

            <BurnInSelector
              value={burnin}
              onChange={handleBurninChange}
            />

            {/* Burn-in error */}
            {errors.burnin && (
              <div className="flex items-center gap-1.5 mt-1">
                <HugeiconsIcon icon={Alert01Icon} className="h-3.5 w-3.5 shrink-0 text-destructive" />
                <p className="text-xs text-destructive">{errors.burnin}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default CaptionSettings