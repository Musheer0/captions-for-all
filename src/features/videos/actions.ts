import prisma from "@/lib/prisma"

export const getVideoById = async(id:string)=>{
    const video =await prisma.video.findFirst({
        where:{
            id
        }
    })
    return video
}
export const getVideoCaptionByVideoIdLang = async(id:string,lang:string)=>{
    const video =await prisma.caption.findFirst({
        where:{
            video_id:id,
            lang
        }
    })
    return video
}