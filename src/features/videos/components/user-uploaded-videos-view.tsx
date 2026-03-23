"use client"
import ViewHeader from'@/components/view-header'
import React from 'react'
import UploadVideoDialog from './upload-video-dialog'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Upload02Icon } from '@hugeicons/core-free-icons'
import VideoList from './video-list'

const UserUploadVideosView = () => {
  return (
    <div className='w-full max-w-6xl sm:pt-20 overflow-y-auto  mx-auto flex-1  flex-col flex '>
        <ViewHeader title='Your Uploaded Videos'>
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
           
        </ViewHeader>
       <div className="bottom overflow-y-auto flex-1 w-full ">
         <VideoList/>
       </div>
    </div>
  )
}

export default UserUploadVideosView