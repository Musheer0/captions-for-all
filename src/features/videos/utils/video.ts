// video.utils.ts

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const statusConfig = {
  FINALIZED: {
    icon: "CheckmarkCircle02Icon",
    label: "Finalized",
    className: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400",
  },
  UPLOADING: {
    icon: "ArrowUpIcon",
    label: "Uploading",
    className: "bg-violet-500/10 text-violet-600 border border-violet-500/20 dark:text-violet-400",
    animate: "animate-bounce",
  },
  PROCESSING: {
    icon: "Loading03Icon",
    label: "Processing",
    className: "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400",
    animate: "animate-spin",
  },
  FAILED: {
    icon: "AlertCircleIcon",
    label: "Failed",
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
} as const

export function resolveStatus(status: string) {
  if (status === "FINISHED_UPLOADING") return statusConfig.FINALIZED
  if (status.includes("FAILED")) return statusConfig.FAILED
  if (status === "PROCESSING") return statusConfig.PROCESSING
  return statusConfig.UPLOADING
}