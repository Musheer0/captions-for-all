import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
interface Props {
    name :string,
    children:React.ReactNode
}
const PageHeader:React.FC<Props> = ({name,children}) => {
  return (
    <div className='w-full border-b flex items-center justify-between  py-3 px-4'>
        <div className="left flex items-center justify-between">
            <SidebarTrigger/>
        <p className='font-semibold'>
            {name}
        </p>
        </div>
        {children}
    </div>
  )
}

export default PageHeader