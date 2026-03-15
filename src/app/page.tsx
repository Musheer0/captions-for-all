import UploadVideo from '@/features/videos/components/upload-video-component'
import UploadVideoToast from '@/features/videos/components/upload-video-toast'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
      <UserButton/>
      <UploadVideo/>
      <UploadVideoToast/>
    </div>
  )
}

export default page