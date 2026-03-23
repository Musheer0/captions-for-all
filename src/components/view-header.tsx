import { SearchIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

const ViewHeader = ({title,children, placeholder, hideSearch}:{title:string ,children:React.ReactNode,placeholder?:string,hideSearch?:boolean}) => {
  return (
    <div className={cn(
      'flex sticky top-0 z-10 flex-col gap-4 items-center justify-between p-5 px-2',
      hideSearch && 'sm:flex hidden'
    )}>
     <div className="top sm:flex hidden w-full justify-between items-center">
           <p className='font-bold text-2xl tracking-tight'>
            {title}
        </p>
        {children}
     </div>
     {!hideSearch &&
     <div className="bottom relative w-full">
        <HugeiconsIcon
        icon={SearchIcon}
        size={18}
        className='text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2'
        />
        <Input
        placeholder={placeholder||'Search Video'}
        className='flex-1 rounded-xl h-auto! py-2.5 pl-8'
        />
     </div>
     }
    </div>
  )
}

export default ViewHeader