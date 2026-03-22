import z from "zod";

export const  AddCaptionsToVideoSchema = z.object({
    video_ids:z.array(z.string()),
    language_code:z.string(),
    burn_type:z.enum(["soft","hard"]),
    
})
export const  AddCaptionsToVideoInngestSchema = z.object({
    video_id:z.string(),
    language_code:z.string(),
    burn_type:z.enum(["soft","hard"]),
    userId:z.string(),
    userEmail:z.string()
})