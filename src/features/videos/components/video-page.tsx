"use client"

interface Props {
  id: string
}

import { useTRPC } from '@/trpc/client'
import { useQuery, useMutation } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
import { Download, Globe, HardDrive, FileVideo, Clock, AlertTriangle } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(d))
}

const STATUS_STYLES: Record<string, { dot: string; text: string; label: string }> = {
  PENDING:    { dot: 'bg-amber-400',              text: 'text-amber-400',   label: 'Pending' },
  PROCESSING: { dot: 'bg-blue-400 animate-pulse', text: 'text-blue-400',    label: 'Processing' },
  COMPLETED:  { dot: 'bg-emerald-400',            text: 'text-emerald-400', label: 'Ready' },
  FAILED:     { dot: 'bg-red-400',                text: 'text-red-400',     label: 'Failed' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { dot: 'bg-zinc-400', text: 'text-zinc-400', label: status }
  return (
    <span className={`flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function MetaChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2.5 text-xs text-zinc-400">
      <span className="text-zinc-500">{icon}</span>
      {label}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-start justify-center p-6 sm:p-10">
      <div className="w-full max-w-2xl border border-zinc-800 rounded-2xl bg-zinc-900 overflow-hidden animate-pulse">
        <div className="aspect-video bg-zinc-800" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-zinc-800 rounded-md w-2/3" />
          <div className="flex gap-3 pt-2">
            {[1, 2, 3].map(i => <div key={i} className="h-9 flex-1 bg-zinc-800 rounded-lg" />)}
          </div>
          <div className="h-px bg-zinc-800 my-2" />
          <div className="h-10 w-36 bg-zinc-800 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const VideoPage: React.FC<Props> = ({ id }) => {
  const trpc = useTRPC()
  const { data, isLoading, isError } = useQuery(
    trpc.video.getVideoById.queryOptions({ videoId: id })
  )

  const { isPending: gettingDownloadUrl, mutateAsync: getDownloadUrl } = useMutation(
    trpc.video.downloadFile.mutationOptions({
      onError: () => toast.error('Error downloading video'),
      onSuccess: () => toast.success(`Downloading ${data?.original_file_name}`),
    })
  )

  async function handleDownload() {
    if (!data) return
    try {
      const result = await getDownloadUrl({ id: data.id })
      if (!result?.url) return
      const a = document.createElement('a')
      a.href = result.url
      a.download = `${data.lang}-${data.original_file_name}` || 'video'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) return <Skeleton />

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <AlertTriangle className="w-8 h-8 opacity-50" />
          <p className="text-sm">Could not load video</p>
        </div>
      </div>
    )
  }

  const canDownload = data.status === 'FINISHED_UPLOADING'
  const ext = data.original_file_name.split('.').pop()?.toUpperCase() ?? 'FILE'

  return (
    <div className="min-h-screen bg-zinc-950 flex items-start justify-center p-6 sm:p-10">
      <div className="w-full max-w-2xl border border-zinc-800 rounded-2xl bg-zinc-900 overflow-hidden shadow-2xl shadow-black/50">

        {/* Player placeholder */}
        <div className="relative aspect-video bg-zinc-950 border-b border-zinc-800 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 opacity-30 select-none">
            <FileVideo className="w-12 h-12 text-zinc-400" />
            <p className="text-xs tracking-widest uppercase text-zinc-500">No preview</p>
          </div>
          <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur border border-zinc-700/60 rounded-full px-3 py-1.5">
            <StatusBadge status={data.status} />
          </div>
        </div>

        {/* Info */}
        <div className="p-6 space-y-5">

          {/* Title + ext badge */}
          <div className="flex items-start gap-3">
            <h1 className="flex-1 min-w-0 text-lg font-semibold text-zinc-100 leading-snug break-all">
              {data.original_file_name}
            </h1>
            <span className="shrink-0 mt-0.5 text-[10px] font-bold tracking-widest uppercase text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded px-2 py-1">
              {ext}
            </span>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2">
            <MetaChip icon={<HardDrive className="w-3.5 h-3.5" />} label={formatBytes(data.size)} />
            <MetaChip icon={<Globe className="w-3.5 h-3.5" />} label={data.lang.toUpperCase()} />
            <MetaChip icon={<Clock className="w-3.5 h-3.5" />} label={formatDate(data.created_at)} />
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Download button */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleDownload}
              disabled={!canDownload || gettingDownloadUrl}
              className={`
                inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${canDownload && !gettingDownloadUrl
                  ? 'bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white shadow-lg shadow-violet-900/40 hover:-translate-y-px active:translate-y-0 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                }
              `}
            >
              {gettingDownloadUrl ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {gettingDownloadUrl ? 'Preparing…' : 'Download'}
            </button>

            {!canDownload && (
              <p className="text-xs text-zinc-500">
                Available once processing is complete
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default VideoPage