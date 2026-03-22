interface params {
    id :string
}
import VideoPage from '@/features/videos/components/video-page'
import React from 'react'

const page = async({params}:{params:Promise<params>}) => {
    const {id} = await params
  return (
  <VideoPage id={id}/>
  )
}

export default page