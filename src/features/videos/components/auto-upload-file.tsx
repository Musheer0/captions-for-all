"use client"
import React, { useEffect, useRef } from 'react'
import { VideoFileStore } from '@/features/videos/store/video-files-store'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle01Icon, DeleteIcon, LoaderCircle, Video01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadToS3 } from '@/lib/upload-to-s3'
import { useAddVideoToCache } from '../hooks/use-add-video'
import { useUpdateVideoStatusCache } from '../hooks/use-update-video-status'
import { useRemoveVideoFromCache } from '../hooks/use-delete-video-from-cache'

// --- Individual file row ---
type FileRowProps = {
  file: File
  state: 'uploading' | 'pending' | 'done' | 'failed'
  progress?: number
  onDelete: () => void
  noBorder: boolean
}

const FileRow = ({ file, state, progress = 0, onDelete, noBorder }: FileRowProps) => {
  const isUploading = state === 'uploading'
  const isDone = state === 'done'
  const isFailed = state === 'failed'

  return (
    <div className={cn('w-full flex flex-col gap-1.5 py-3 px-2', !noBorder && 'border-b')}>
      <div className="flex items-center gap-2">
        <div className={cn(
          'shrink-0 p-1.5 rounded-lg',
          isDone ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500'
            : isFailed ? 'bg-red-100 dark:bg-red-900/40 text-red-500'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
        )}>
          <HugeiconsIcon size={17} color="currentColor" strokeWidth={1.5} icon={Video01Icon} />
        </div>

        <p className={cn('truncate text-sm mr-auto font-semibold', isFailed ? 'opacity-40' : 'opacity-70')}>
          {file.name}
        </p>

        {isUploading && (
          <span className="text-xs font-semibold text-muted-foreground shrink-0">{progress}%</span>
        )}
        {isDone && (
          <HugeiconsIcon size={18} color="currentColor" strokeWidth={1.5} icon={CheckmarkCircle01Icon} className="text-emerald-500 shrink-0" />
        )}
        {isUploading && (
          <HugeiconsIcon size={17} color="currentColor" strokeWidth={1.5} icon={LoaderCircle} className="animate-spin shrink-0" />
        )}
        {(state === 'pending' || isFailed) && (
          <Button onClick={onDelete} size={"icon-sm"} variant={"destructive"}>
            <HugeiconsIcon size={17} color="currentColor" strokeWidth={1.5} icon={DeleteIcon} />
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {isFailed && (
        <p className="text-xs text-red-500 font-medium px-0.5">Upload failed.</p>
      )}
    </div>
  )
}

// --- Auto-upload orchestrator hook ---
function useAutoUpload(onFailed: (file: File) => void) {
  const trpc = useTRPC()
  // mutateAsync throws on error   works correctly inside async/await
  const { mutateAsync } = useMutation(trpc.video.getUploadUrl.mutationOptions())
  const update_file_status = useMutation(trpc.video.update_uploadStatus.mutationOptions())
  const delete_file = useMutation(trpc.video.deleteVideo.mutationOptions())
  const { uploadingFile, pendingFiles, startUpload, markUploaded, nextPendingFile } = VideoFileStore()

  const [progress, setProgress] = React.useState(0)
  const abortRef = useRef<AbortController | null>(null)
  const isUploadingRef = useRef(false)
  const addVideoToCache = useAddVideoToCache()
  const updateVideoStatusCache = useUpdateVideoStatusCache()
  const deleteVideoFromCache = useRemoveVideoFromCache()
  useEffect(() => {
    if (uploadingFile || pendingFiles.length === 0 || isUploadingRef.current) return

    const file = nextPendingFile()
    if (!file) return

    isUploadingRef.current = true
    startUpload(file)
    setProgress(0)

    const controller = new AbortController()
    abortRef.current = controller

    const run = async () => {
      try {
        const data = await mutateAsync({ file_name: file.name ,file_type:file.type,file_size:file.size})
        addVideoToCache(data.video)
        
      try {
         await uploadToS3(file,data.signedUrl,setProgress)
         await update_file_status.mutateAsync({status:"FINISHED_UPLOADING",videoId:data.video.id})
         updateVideoStatusCache(data.video.id,"FINISHED_UPLOADING")
      } catch (error) {
        console.log(error)
        toast.error("failed to upload file")
        await delete_file.mutateAsync({videoId:data.video.id,dontremoves3:true})
                 updateVideoStatusCache(data.video.id,"FAILED")

        deleteVideoFromCache(data.video.id)
      }
      
        markUploaded(file)
      } catch (err) {
        toast.error("failed to upload file")
        markUploaded(file) // resets uploadingFile in store so queue continues
        onFailed(file)
      } finally {
        setProgress(0)
        isUploadingRef.current = false
      }
    }

    run()
  }, [uploadingFile, pendingFiles])

  useEffect(() => () => { abortRef.current?.abort() }, [])

  return { progress }
}

// --- Main component ---
const AutoUploadFileComponent = () => {
  const {
    pendingFiles,
    uploadingFile,
    uploadedFile,
    removePendingByIndex,
    clearUploaded,
  } = VideoFileStore()

  const [doneFiles, setDoneFiles] = React.useState<File[]>([])
  const [localFailedFiles, setLocalFailedFiles] = React.useState<File[]>([])

  const { progress } = useAutoUpload((file) => {
    setLocalFailedFiles((prev) => [...prev, file])
  })

  useEffect(() => {
    if (!uploadedFile) return
    setDoneFiles((prev) => [...prev, uploadedFile])
    clearUploaded()
  }, [uploadedFile])

  useEffect(() => {
    if (doneFiles.length === 0) return
    const t = setTimeout(() => setDoneFiles((prev) => prev.slice(1)), 1000)
    return () => clearTimeout(t)
  }, [doneFiles])

  const allRows = [
    ...doneFiles.map((f) => ({ file: f, state: 'done' as const })),
    ...localFailedFiles.map((f) => ({ file: f, state: 'failed' as const })),
    ...(uploadingFile ? [{ file: uploadingFile, state: 'uploading' as const }] : []),
  ]

  return (
    <>
      {allRows.map(({ file, state }, i) => (
        <FileRow
          key={`${file.name}-${state}`}
          file={file}
          state={state}
          progress={state === 'uploading' ? progress : undefined}
          noBorder={i === allRows.length - 1}
          onDelete={() => {
          if (state === 'failed') {
              setLocalFailedFiles((prev) => prev.filter((f) => f !== file))
            }
          }}
        />
      ))}
    </>
  )
}

export default AutoUploadFileComponent