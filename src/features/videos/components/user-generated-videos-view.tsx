"use client"
import ViewHeader from'@/components/view-header'
import React from 'react'
import UploadVideoDialog from './upload-video-dialog'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, Upload02Icon } from '@hugeicons/core-free-icons'
import VideoList from './video-list'
import Link from 'next/link'

const UserGeneratedVideosView = () => {
  return (
    <div className='w-full max-w-6xl sm:pt-20 overflow-y-auto  mx-auto flex-1  flex-col flex '>
        <ViewHeader title='Your Captioned Videos'>
            <div className="right flex items-center gap-1">
              <UploadVideoDialog>
                <Button className={"rounded-xl"}>
                    <HugeiconsIcon
                    icon={Upload02Icon}
                    />
                    <p className='hidden sm:flex'>
                        Upload Video
                    </p>
                </Button>
            </UploadVideoDialog>
             <Link href={'/add-captions'}>
             <Button className={"rounded-xl"}>
                    <HugeiconsIcon
                    icon={PlusSignIcon}
                    />
                    <p className='hidden sm:flex'>
                        Add Caption To Video
                    </p>
                </Button>
             </Link>
            </div>
        </ViewHeader>
       <div className="bottom overflow-y-auto flex-1 w-full ">
         <VideoList generatedOnly/>
       </div>
    </div>
  )
}

export default UserGeneratedVideosView