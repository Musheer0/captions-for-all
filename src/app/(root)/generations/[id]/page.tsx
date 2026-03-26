interface params {
    id :string
}
import { Button } from '@/components/ui/button'
import PageHeader from '@/features/dashboard/page-header'
import VideoPage from '@/features/videos/components/video-page'
import React from 'react'

const page = async({params}:{params:Promise<params>}) => {
    const {id} = await params
  return (
 <div className='flex-1 w-full flex flex-col'>
  <PageHeader name='Generations'>
    <Button>
      Help
    </Button>
  </PageHeader>
   <VideoPage id={id}/>
 </div>
  )
}

export default page