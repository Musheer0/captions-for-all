import z from "zod";

export const ExtractCaptionsFromVideoSchema = z.object({
    video_id:z.string(),
    user_id:z.string()
})
export const BurnCaptionToVideoSchema = z.object({
    video_id:z.string(),
    user_id:z.string(),
    lang_code:z.string()
})