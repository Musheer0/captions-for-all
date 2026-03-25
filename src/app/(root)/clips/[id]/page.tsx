interface params {
    id :string
}
import ClipPage from '@/features/clip-videos/components/clip-page'
import React from 'react'

const page = async({params}:{params:Promise<params>}) => {
    const {id} =await params
  return (
    <ClipPage id={id}/>
  )
}

export default page