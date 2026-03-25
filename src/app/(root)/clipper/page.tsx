import { Button } from '@/components/ui/button'
import CreateClipView from '@/features/clip-videos/components/create-clip-view'
import PageHeader from '@/features/dashboard/page-header'
import UploadVideoDialog from '@/features/videos/components/upload-video-dialog'
import { Upload01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

const page = () => {
  return (
    <div className='w-full flex overflow-y-auto flex-col flex-1 '>
      <PageHeader
      name='Clip Video'
      >
        <UploadVideoDialog>
          <Button className={"sm:hidden rounded-xl "}>
            <HugeiconsIcon
            icon={Upload01Icon}
            />
            upload video
          </Button>
        </UploadVideoDialog>
      </PageHeader>
      <CreateClipView/>
    </div>
  )
}

export default page