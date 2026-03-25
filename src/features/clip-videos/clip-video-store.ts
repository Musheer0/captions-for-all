import { Video } from "@/generated/prisma/client";
import { create } from "zustand";

interface Store {
    count:number,
    video:Video|null,
    setVideo:(data:Video|null)=>void,
    setCount:(data:number)=>void
}

export const useCreateClipVideoStore = create<Store>((set)=>({
    count:1,
    video:null,
    setVideo(data) {
        set({video:data})
    },
    setCount(data) {
        set({count:data})
    },
}))