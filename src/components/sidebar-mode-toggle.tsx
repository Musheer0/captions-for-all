"use client"

import { useTheme } from "next-themes"

import {
  Sun01Icon,
  Moon02Icon,
  ComputerIcon
} from "@hugeicons/core-free-icons"

import { HugeiconsIcon } from "@hugeicons/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton } from "@/components/ui/sidebar"

export function SidebarThemeToggle() {
  const { setTheme } = useTheme()

  return (
   <SidebarGroup>
    <SidebarGroupContent>
        <SidebarGroupLabel>
            Appearance
        </SidebarGroupLabel>
         <DropdownMenu>
      <DropdownMenuTrigger className={'w-full'} slot="div">
        <SidebarMenuButton  slot="div">
          <HugeiconsIcon icon={Sun01Icon} className="dark:hidden" size={18} />
          <HugeiconsIcon icon={Moon02Icon} className="hidden dark:block" size={18} />
          <span>Theme</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <HugeiconsIcon icon={Sun01Icon} size={18} className="mr-2" />
          Light
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <HugeiconsIcon icon={Moon02Icon} size={18} className="mr-2" />
          Dark
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")}>
          <HugeiconsIcon icon={ComputerIcon} size={18} className="mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </SidebarGroupContent>
   </SidebarGroup>
  )
}
