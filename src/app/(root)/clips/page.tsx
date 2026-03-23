import { Button } from '@/components/ui/button'
import UserClippedVideosView from '@/features/clip-videos/components/user-clipped-videos-view'
import PageHeader from '@/features/dashboard/page-header'
import React from 'react'

const page = () => {
  return (
    <div className='w-full bg-sidebar flex h-full max-h-screen  flex-col flex-1'>
        <PageHeader  name='Videos'>
          <div className="right flex items-center gap-2">
             <Button className={"rounded-xl"}>
            FeedBack
           </Button>
           <Button className={"rounded-xl"} variant={"destructive"}>
            Help
           </Button>
          </div>
        </PageHeader>
      <UserClippedVideosView/>
    </div>
  )
}

export default page