"use client"
import ViewHeader from'@/components/view-header'
import React from 'react'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Upload02Icon } from '@hugeicons/core-free-icons'
import ClipsList from './clips-list'

const UserClippedVideosView = () => {
  return (
    <div className='w-full max-w-6xl sm:pt-20 overflow-y-auto  mx-auto flex-1  flex-col flex '>
        <ViewHeader title='Your Clips'  hideSearch>
            <></>
           
        </ViewHeader>
       <div className="bottom overflow-y-auto flex-1 w-full ">
       <ClipsList/>
       </div>
    </div>
  )
}

export default UserClippedVideosView