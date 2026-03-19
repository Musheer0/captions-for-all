"use client"
import React from 'react'
import { VideoFileStore } from '@/features/videos/store/video-files-store'
import { HugeiconsIcon } from '@hugeicons/react'
import { DeleteIcon, LoaderCircle, Video01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import AutoUploadFileComponent from './auto-upload-file'

const FileComponent = ({file,noBorder, onDelete}:{file:File,noBorder:boolean, onDelete:()=>void}) => {
        
  return (
    <div className={cn(
        'w-full flex items-center gap-2 justify-between   py-3  px-2',
        !noBorder && 'border-b'
    )}>
        <div className="shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500' p-1.5 rounded-lg">
             <HugeiconsIcon
        size={17}
        color="currentColor" strokeWidth={1.5} 
        icon={Video01Icon}
        />
        </div>
       
        <p className='truncate text-sm opacity-70  mr-auto font-semibold'>
            {file.name}
        </p>
         <HugeiconsIcon
        size={17}
        color="currentColor" strokeWidth={1.5} 
        icon={LoaderCircle}
        className='animate-spin'
        />
        <Button
        onClick={onDelete}
        size={"icon-sm"} variant={"destructive"}>
<HugeiconsIcon
        size={17}
        color="currentColor" strokeWidth={1.5} 
        icon={DeleteIcon}
        
        />
        </Button>
    </div>
  )
}

const UploadVideoToast = () => {
    const {pendingFiles,uploadedFile,removePendingByIndex, uploadingFile} = VideoFileStore()
if(pendingFiles.length>0 || uploadingFile || uploadedFile)
  return (
    <div className='fixed right-0 bottom-0 p-2 w-fit max-h-[50vh] h-fit '>
        <div className="files-container w-sm   bg-zinc-200 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700 rounded-xl">
        {/* header */}
            <div className="header p-4 flex w-full items-center justify-between">
                <p className='text-[13px] tracking-wide font-semibold leading-none text-zinc-600 dark:text-zinc-300 uppercase'>Uploading Files</p>
    <p className='text-xs font-semibold leading-none text-muted-foreground uppercase'> {pendingFiles.length} pending</p>
               
            </div>
<div className="files-list py-3 overflow-y-auto h-full max-h-[40vh] rounded-b-xl w-full  bg-background border border-zinc-200 dark:border-zinc-700">
   {/* uploading file files */}
       <AutoUploadFileComponent/>
        {/* pending files */}
        {pendingFiles.map((p,i)=>{
            return (
                <FileComponent
                onDelete={()=>{
                    removePendingByIndex(i)
                }}
                noBorder={i===pendingFiles.length-1} key={i} file={p}/>
            )
        })}
</div>
        </div>
    </div>
  )
}

export default UploadVideoToast