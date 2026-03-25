import { useTRPC } from '@/trpc/client'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'

export const useGetVideoClips = (clip_id:string) => {
    const trpc = useTRPC()
    return useQuery(trpc.clips.getClipsByVideo.queryOptions({clip_id}))
}


export const useClips = ()=>{
      const trpc = useTRPC()
  return useInfiniteQuery(trpc.clips.getCLips.infiniteQueryOptions(
        { limit: 10 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    )
}