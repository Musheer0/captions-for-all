import { create } from "zustand"

type Store = {
  uploadingFile: File | null
  uploadedFile: File | null
  pendingFiles: File[]
  failedFiles: File[]

  addPendingFile: (file: File) => void
  addPendingFiles: (file: File[]) => void
  startUpload: (file: File) => void
  markUploaded: (file: File) => void
  markFailed: (file: File) => void
  clearUploaded: () => void

  nextPendingFile: () => File | undefined
  removePendingByIndex: (index: number) => void
}

export const VideoFileStore = create<Store>((set, get) => ({
  uploadingFile: null,
  uploadedFile: null,
  pendingFiles: [],
  failedFiles: [],

  addPendingFile: (file) =>
    set((state) => ({
      pendingFiles: [...state.pendingFiles, file],
    })),
 addPendingFiles: (file) =>
    set((state) => ({
      pendingFiles: [...state.pendingFiles, ...file],
    })),
  startUpload: (file) =>
    set((state) => ({
      uploadingFile: file,
      pendingFiles: state.pendingFiles.filter((f) => f !== file),
    })),

  markUploaded: (file) =>
    set({
      uploadingFile: null,
      uploadedFile: file,
    }),

  markFailed: (file) =>
    set((state) => ({
      uploadingFile: null,
      failedFiles: [...state.failedFiles, file],
    })),

  clearUploaded: () =>
    set({
      uploadedFile: null,
    }),

  nextPendingFile: () => {
    const files = get().pendingFiles
    const next = files[0]

    set({
      pendingFiles: files.slice(1),
    })

    return next
  },

  removePendingByIndex: (index) =>
    set((state) => ({
      pendingFiles: state.pendingFiles.filter((_, i) => i !== index),
    })),
}))