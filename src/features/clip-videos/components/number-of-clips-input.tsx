"use client"
import { MinusSignIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React, { useState, useCallback } from 'react'

const NumberOfClipsInputPanel = ({
  value,
  onChange,
}: {
  value: number
  onChange: (val: number) => void
}) => {
  const [val, setValue] = useState(value)
  const [animKey, setAnimKey] = useState(0)

  const handleChange = useCallback((sign: "+" | "-") => {
    setValue((prev) => {
      const next =
        sign === "+"
          ? prev < 6 ? prev + 1 : prev
          : prev > 1 ? prev - 1 : prev
      if (next !== prev) {
        setAnimKey((k) => k + 1)
        onChange(next)
      }
      return next
    })
  }, [onChange])

  const atMin = val <= 1
  const atMax = val >= 6

  return (
    <div className="w-full flex flex-col items-center py-8 gap-6">

      {/* Step label */}
      <div className="flex items-center gap-2 self-start px-1">
        <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
          Step 1 of 2
        </span>
        <div className="h-px w-12 bg-border" />
      </div>

      {/* Title   hidden on sm (shown in ViewHeader) */}
      <div className="hidden sm:block self-start px-1 space-y-0.5">
        <p className="text-xl font-semibold">How many clips?</p>
        <p className="text-sm text-muted-foreground">Max 6   computing isn't free</p>
      </div>

      {/* Counter row */}
      <div className="flex items-center gap-6 w-full max-w-xs">

        {/* Minus */}
        <button
          onClick={() => handleChange("-")}
          disabled={atMin}
          aria-label="Decrease"
          className={[
            "flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-150",
            atMin
              ? "opacity-25 cursor-not-allowed border-border bg-transparent"
              : "border-border bg-background hover:bg-muted/50 active:scale-95 cursor-pointer",
          ].join(" ")}
        >
          <HugeiconsIcon icon={MinusSignIcon} size={18} className="text-foreground" />
        </button>

        {/* Number + dots */}
        <div className="flex flex-col items-center flex-1 gap-3">
          <span
            key={animKey}
            className="text-7xl font-black leading-none tabular-nums select-none animate-in fade-in zoom-in-95 duration-100"
          >
            {val}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={[
                  "block rounded-full transition-all duration-300",
                  i < val
                    ? "w-4 h-1.5 bg-foreground"
                    : "w-1.5 h-1.5 bg-muted-foreground/25",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        {/* Plus */}
        <button
          onClick={() => handleChange("+")}
          disabled={atMax}
          aria-label="Increase"
          className={[
            "flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-150",
            atMax
              ? "opacity-25 cursor-not-allowed border-border bg-transparent"
              : "border-border bg-background hover:bg-muted/50 active:scale-95 cursor-pointer",
          ].join(" ")}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={18} className="text-foreground" />
        </button>
      </div>

      {atMax && (
        <p className="text-xs text-muted-foreground animate-in fade-in duration-200">
          Maximum reached   your wallet is safe
        </p>
      )}

      <div className="w-full h-px bg-border" />
    </div>
  )
}

export default NumberOfClipsInputPanel