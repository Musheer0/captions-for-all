import { Button } from '@/components/ui/button'
import PageHeader from '@/features/dashboard/page-header'
import UploadVideoDialog from '@/features/videos/components/upload-video-dialog'
import VideoList from '@/features/videos/components/video-list'
import { PlusSignCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

const page = () => {
  return (
    <div className='w-full bg-sidebar h-full flex-1'>
        <PageHeader  name='Generated Videos'>
            <UploadVideoDialog>
              <Button
            className={'rounded-xl'}
            >
                <HugeiconsIcon
                icon={PlusSignCircleIcon}
                />
                Upload Video
            </Button>
            </UploadVideoDialog>
        </PageHeader>
        <VideoList generatedOnly/>
    </div>
  )
}

export default page