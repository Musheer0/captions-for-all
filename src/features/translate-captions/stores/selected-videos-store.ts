import { Video } from "@/generated/prisma/client"
import { create } from "zustand"


type SelectedVideoStore = {
  selectedVideos: Video[]

  addVideo: (video: Video) => void
  removeVideo: (videoId: string) => void
  toggleVideo: (video: Video) => void
  clear: () => void

  isSelected: (videoId: string) => boolean
}

export const useSelectedVideoStore = create<SelectedVideoStore>((set, get) => ({
  selectedVideos: [],

  addVideo: (video) => {
    const exists = get().selectedVideos.some((v) => v.id === video.id)
    if (exists) return

    set((state) => ({
      selectedVideos: [...state.selectedVideos, video],
    }))
  },

  removeVideo: (videoId) => {
    set((state) => ({
      selectedVideos: state.selectedVideos.filter((v) => v.id !== videoId),
    }))
  },

  toggleVideo: (video) => {
    const exists = get().selectedVideos.some((v) => v.id === video.id)

    if (exists) {
      set((state) => ({
        selectedVideos: state.selectedVideos.filter((v) => v.id !== video.id),
      }))
    } else {
      set((state) => ({
        selectedVideos: [...state.selectedVideos, video],
      }))
    }
  },

  clear: () => set({ selectedVideos: [] }),

  isSelected: (videoId) => {
    return get().selectedVideos.some((v) => v.id === videoId)
  },
}))