import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full relative  h-screen flex items-center '>
        <div className='bg-primary relative flex-1 h-full flex flex-col items-start justify-center'>
              <p className='absolute top-5 left-5 text-xs text-background'>
                CAF
            </p>
        </div>
        <div className='relative flex items-center justify-center bg-gradient-to-br to-muted h-full  flex-1'>
          
            {children}
        </div>
 
    </div>
  );
};

export default Layout;