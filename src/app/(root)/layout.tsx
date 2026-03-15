import { ThemeProvider } from '@/components/theme-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/features/dashboard/sidebar/app-sidebar';
import UploadVideoToast from '@/features/videos/components/upload-video-toast';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
        attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar/>
        
        <SidebarInset className='bg-sidebar'>
            {children}
            <UploadVideoToast/>
        </SidebarInset>
    </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;