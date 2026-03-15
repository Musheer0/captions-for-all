"use client"
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import React, { useState } from 'react'
import UploadVideo from './upload-video-component'

const UploadVideoDialog = ({children}:{children:React.ReactNode}) => {
    const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger  slot='div' >
            {children}
        </DialogTrigger>
        <DialogContent className={'bg-transparent'}>
            <UploadVideo onUploadComplete={()=>{setOpen(false)}}/>
        </DialogContent>
    </Dialog>
  )
}

export default UploadVideoDialog