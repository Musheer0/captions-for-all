"use client"
import { Video } from '@/generated/prisma/client'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  CloudUploadIcon,
  Tick02Icon,
  Video01Icon,
  Upload04Icon,
  AlertCircleIcon,
  Delete02Icon,
} from '@hugeicons/core-free-icons'
import { VideoFileStore } from '../store/video-files-store'

interface Props {
  onUploadComplete?: () => void
}

interface FileWithStatus {
  file: File
  id: string
  status: 'pending' | 'ready' | 'error'
  error?: string
  isDuplicate?: boolean
}

const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024 // 1GB
const MAX_FILES = 24

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB'
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

function fileKey(file: File): string {
  return `${file.name}__${file.size}__${file.lastModified}`
}

const UploadVideo: React.FC<Props> = ({onUploadComplete}) => {
  const { addPendingFiles, uploadingFile } = VideoFileStore()
  const [files, setFiles] = useState<FileWithStatus[]>([])

  const duplicateFiles = files.filter((f) => f.isDuplicate)
  const hasDuplicates = duplicateFiles.length > 0
  const readyCount = files.filter((f) => !f.isDuplicate).length
  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      const currentCount = files.length

      rejectedFiles.forEach((rejected) => {
        rejected.errors.forEach((err: any) => {
          if (err.code === 'file-too-large') {
            toast.error(`"${rejected.file.name}" exceeds 1 GB limit`)
          } else if (err.code === 'file-invalid-type') {
            toast.error(`"${rejected.file.name}" is not a valid video file`)
          } else {
            toast.error(`"${rejected.file.name}": ${err.message}`)
          }
        })
      })

      if (currentCount + acceptedFiles.length > MAX_FILES) {
        const allowed = MAX_FILES - currentCount
        if (allowed <= 0) {
          toast.error(`Maximum ${MAX_FILES} files allowed`)
          return
        }
        toast.warning(`Only ${allowed} more file(s) can be added. Adding first ${allowed}.`)
        acceptedFiles = acceptedFiles.slice(0, allowed)
      }

      // Detect duplicates against existing files
      const existingKeys = new Set(files.map((f) => fileKey(f.file)))
      let duplicateCount = 0

      const newFiles: FileWithStatus[] = acceptedFiles.map((file) => {
        const key = fileKey(file)
        const isDuplicate = existingKeys.has(key)
        if (isDuplicate) duplicateCount++
        existingKeys.add(key) // catch dupes within the same drop batch too
        return {
          file,
          id: `${key}-${Math.random()}`,
          status: 'ready',
          isDuplicate,
        }
      })

      setFiles((prev) => [...prev, ...newFiles])

      const fresh = newFiles.filter((f) => !f.isDuplicate)
     
      if (duplicateCount > 0) {
        toast.warning(
          `${duplicateCount} duplicate${duplicateCount !== 1 ? 's' : ''} detected`,
          { description: 'Review and remove them before uploading.', duration: 5000 }
        )
      }
    },
    [files]
  )

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const removed = prev.find((f) => f.id === id)
      const updated = prev.filter((f) => f.id !== id)
   
      return updated
    })
  }

  const removeDuplicates = () => {
    setFiles((prev) => {
      const seen = new Set<string>()
      const deduped = prev.filter((f) => {
        const key = fileKey(f.file)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      const cleaned = deduped.map((f) => ({ ...f, isDuplicate: false }))
      return cleaned
    })
  }

  const clearAll = () => {
    setFiles([])
  }

  const uploadFiles = () => {
    const readyFiles = files.filter((f) => !f.isDuplicate)
    addPendingFiles(readyFiles.map((f) => f.file))
    console.log(
      '📁 Uploading files:',
      readyFiles.map((f) => ({ name: f.file.name, size: formatBytes(f.file.size), type: f.file.type }))
    )
    clearAll()
    if(onUploadComplete) onUploadComplete()
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    multiple: true,
  })

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3 p-1">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300
          flex flex-col items-center justify-center gap-3 py-12 px-6 text-center
          ${
            isDragReject
              ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
              : isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-[1.01]'
              : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }
        `}
      >
        <input {...getInputProps()} disabled={files.length === MAX_FILES} />

        {/* Icon */}
        <div
          className={`
            rounded-2xl p-4 transition-all duration-300
            ${
              isDragReject
                ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                : isDragActive
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500 scale-110'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
            }
          `}
        >
          {isDragReject ? (
            <HugeiconsIcon icon={Cancel01Icon} size={32} color="currentColor" strokeWidth={1.5} />
          ) : isDragActive ? (
            <HugeiconsIcon icon={CloudUploadIcon} size={32} color="currentColor" strokeWidth={1.5} />
          ) : (
            <HugeiconsIcon icon={Video01Icon} size={32} color="currentColor" strokeWidth={1.5} />
          )}
        </div>

        {/* Text */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {isDragReject
              ? 'Invalid file type'
              : isDragActive
              ? 'Drop your videos here'
              : 'Drag & drop videos here'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isDragReject
              ? 'Only video files are accepted'
              : 'or click to browse · Video files only · Max 1 GB per file'}
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            <HugeiconsIcon icon={Video01Icon} size={12} color="currentColor" strokeWidth={1.5} />
            {files.length} / {MAX_FILES} files
          </span>
          {totalSize > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              {formatBytes(totalSize)} total
            </span>
          )}
        </div>
      </div>

      {/* Duplicate Warning Banner */}
      {hasDuplicates && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
          <span className="shrink-0 text-amber-500">
            <HugeiconsIcon icon={AlertCircleIcon} size={18} color="currentColor" strokeWidth={1.5} />
          </span>
          <p className="flex-1 text-xs text-amber-700 dark:text-amber-300 font-medium">
            {duplicateFiles.length} duplicate file{duplicateFiles.length !== 1 ? 's' : ''} detected — {duplicateFiles.length !== 1 ? 'they' : 'it'} will be skipped on upload.
          </p>
          <button
            onClick={removeDuplicates}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-800/60 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors"
          >
            <HugeiconsIcon icon={Delete02Icon} size={13} color="currentColor" strokeWidth={2} />
            Remove duplicates
          </button>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-background dark:border-zinc-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">
              {files.length} video{files.length !== 1 ? 's' : ''} selected
              {hasDuplicates && (
                <span className="ml-2 normal-case font-medium text-amber-500">
                  · {duplicateFiles.length} duplicate{duplicateFiles.length !== 1 ? 's' : ''}
                </span>
              )}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); clearAll() }}
              className="text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
            >
              Clear all
            </button>
          </div>

          {/* Files */}
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-64 overflow-y-auto">
            {files.map(({ file, id, status, isDuplicate }) => (
              <li
                key={id}
                className={`flex items-center gap-3 px-4 py-2.5 transition-colors group/item
                  ${isDuplicate
                    ? 'bg-amber-50/60 dark:bg-amber-950/10 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
              >
                {/* File icon */}
                <div className={`shrink-0 rounded-lg p-1.5
                  ${isDuplicate
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-400'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  <HugeiconsIcon icon={Video01Icon} size={16} color="currentColor" strokeWidth={1.5} />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate leading-tight">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {formatBytes(file.size)}
                    {isDuplicate && (
                      <span className="ml-1.5 text-amber-500 font-medium">· duplicate</span>
                    )}
                  </p>
                </div>

                {/* Status + remove */}
                <div className="flex items-center gap-2 shrink-0">
                  {isDuplicate ? (
                    <span className="text-amber-400">
                      <HugeiconsIcon icon={AlertCircleIcon} size={16} color="currentColor" strokeWidth={1.5} />
                    </span>
                  ) : status === 'ready' ? (
                    <span className="text-emerald-500">
                      <HugeiconsIcon icon={Tick02Icon} size={16} color="currentColor" strokeWidth={1.5} />
                    </span>
                  ) : null}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(id) }}
                    className="text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover/item:opacity-100"
                    aria-label="Remove file"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={1.5} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <button
          onClick={uploadFiles}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-zinc-900 font-semibold text-sm py-3 px-5 transition-all duration-200 active:scale-[0.98]"
        >
          <HugeiconsIcon icon={Upload04Icon} size={17} color="currentColor" strokeWidth={2} />
          {uploadingFile
            ? 'Upload'
            : hasDuplicates
            ? `Upload ${readyCount} file${readyCount !== 1 ? 's' : ''} · skip ${duplicateFiles.length} duplicate${duplicateFiles.length !== 1 ? 's' : ''}`
            : `Upload ${readyCount} video${readyCount !== 1 ? 's' : ''}`
          }
        </button>
      )}
    </div>
  )
}

export default UploadVideo