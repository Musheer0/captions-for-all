import { codes } from "@/constants/languages";
import { create } from "zustand";



export const BURNIN_TYPES = ["soft", "hard"] as const;


type BurnIn = (typeof BURNIN_TYPES)[number];

type CaptionState = {
  text: string;
  burnin: BurnIn;
  languageCode: string;

  setText: (text: string) => void;
  setBurnin: (value: string) => void;
  setLanguageCode: (value: string) => void;
  reset: () => void;
};

const isValid = (value: string, arr: readonly string[]) =>
  arr.includes(value);
export const useCaptionStore = create<CaptionState>((set) => ({
  text: "",
  burnin: "soft",
  languageCode: "og",

  setText: (text) => set({ text }),

  setBurnin: (value) => {
    if (!isValid(value, BURNIN_TYPES)) {
      throw new Error(`Invalid burnin type: ${value}`);
    }
    set({ burnin: value as BurnIn });
  },

  setLanguageCode: (value) => {
    if (!isValid(value, codes)) {
      throw new Error(`Invalid language code: ${value}`);
    }
    set({ languageCode: value  });
  },

  reset: () =>
    set({
      text: "",
      burnin: "soft",
      languageCode: "en",
    }),
}));