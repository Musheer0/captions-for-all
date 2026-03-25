import z from "zod";

export const clipVideoRequest = z.object({
    video_id:z.string(),
    clip_count:z.number().min(1).max(6).default(1),
    video_key:z.string(),
    userEmail:z.string(),
    userId:z.string()
})