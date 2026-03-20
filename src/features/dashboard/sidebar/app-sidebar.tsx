"use client"
import { SidebarThemeToggle } from '@/components/sidebar-mode-toggle'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { routes } from '@/lib/routes'
import { UserButton } from '@clerk/nextjs'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const AppSidebar = () => {
  const pathname =usePathname()
  return (
    <Sidebar collapsible='icon' className=''>
        <SidebarRail/>
        <SidebarHeader>
        <SidebarMenu className='flex group-data-[collapsible=icon]:py-2 items-center gap-2 flex-row'>
          <SidebarMenuItem>
             <SidebarMenuButton>
                 <Image
        width={25}
        height={25}
        src={'logo.svg'}
        alt='logo'
        />
        <p className='font-semibold group-data-[collapsible=icon]:hidden'>Captions4All</p>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
        {routes.map((section, i)=>{
            return(
                      <SidebarGroup key={i} >
                    <SidebarGroupContent >
                        <SidebarGroupLabel>
                            {section.name}
                        </SidebarGroupLabel>
                        {section.routes.map((route,i)=>{
                            return (
                                <Link href={route.route} key={i} className='my-2.5'>
                                    <SidebarMenuButton 
                                    className='
                                    data-active:hover:bg-primary/10 data-active:bg-muted-foreground/10 data-active:rounded-md'
                                    isActive={pathname.includes(route.route)} tooltip={route.name} key={i}>
                                        <HugeiconsIcon
                                        icon={route.icon}
                                        />
                                        {route.name}
                                    </SidebarMenuButton>
                                </Link>
                            )
                        })}
                    </SidebarGroupContent>
                </SidebarGroup>
            )
          })}
          <SidebarThemeToggle/>
        </SidebarContent>
        <SidebarFooter>
  <UserButton
              showName
              fallback={
                <Skeleton className="h-8.5 w-full group-data-[collapsible=icon]:size-8 rounded-md border border-border bg-white" />
              }
              appearance={{
                elements: {
                  rootBox:
                    "w-full! group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:justify-center!",
                  userButtonTrigger:
                    "w-full! justify-between!  pl-1! pr-2! py-1!  group-data-[collapsible=icon]:w-auto! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:after:hidden! [--border:color-mix(in_srgb,transparent,var(--clerk-color-neutral,#000000)_15%)]!",
                  userButtonBox: "flex-row-reverse! gap-2!",
                  userButtonOuterIdentifier: " tracking-tight! text-foreground! pl-0! group-data-[collapsible=icon]:hidden!",
                  userButtonAvatarBox: "size-6!",
                }
              }}
            />
        </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar