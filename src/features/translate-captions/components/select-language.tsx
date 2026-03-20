"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Tick02Icon,
  LanguageCircleIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { languages } from "@/constants/languages"

type Props = {
  value?: string
  onChange?: (code: string) => void
}

export function LanguageSelector({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false)

  const selected =
    languages.find((l) => l.code === value) ??
    languages.find((l) => l.code === "og")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger slot="div" className={'w-full flex-1'}>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="h-9 w-full flex-1 min-w-[120px] justify-between gap-3 rounded-full  px-4 text-sm font-normal text-white   bg-transparent hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2 truncate">
            {selected ? (
              <>
                <span className="text-sm leading-none">{selected.flag}</span>
                <span className="truncate">{selected.language}</span>
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={LanguageCircleIcon}
                  className="h-4 w-4 shrink-0 opacity-60"
                />
                <span className="opacity-60">Select language</span>
              </>
            )}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn(
              "h-4 w-4 shrink-0 opacity-60 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="sm:w-sm  w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList className="max-h-60">
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.code}
                  value={`${lang.language} ${lang.code}`}
                  onSelect={() => {
                    onChange?.(lang.code)
                    setOpen(false)
                  }}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <span className="text-sm leading-none">{lang.flag}</span>
                  <span className="flex-1 truncate">{lang.language}</span>
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    className={cn(
                      "h-4 w-4 shrink-0",
                      selected?.code === lang.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}