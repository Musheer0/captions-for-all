import { create } from "zustand"

export enum CaptionStep {
  SELECT_VIDEO = 1,
  CAPTION_SETTINGS = 2,
}

type CaptionFlowStore = {
  step: CaptionStep

  next: () => void
  back: () => void
  setStep: (step: CaptionStep) => void
  reset: () => void

  isStep: (step: CaptionStep) => boolean
}

export const useCaptionFlowStore = create<CaptionFlowStore>((set, get) => ({
  step: CaptionStep.SELECT_VIDEO,

  next: () => {
    const current = get().step

    if (current === CaptionStep.SELECT_VIDEO) {
      set({ step: CaptionStep.CAPTION_SETTINGS })
    }
  },

  back: () => {
    const current = get().step

    if (current === CaptionStep.CAPTION_SETTINGS) {
      set({ step: CaptionStep.SELECT_VIDEO })
    }
  },

  setStep: (step) => set({ step }),

  reset: () => set({ step: CaptionStep.SELECT_VIDEO }),

  isStep: (step) => get().step === step,
}))