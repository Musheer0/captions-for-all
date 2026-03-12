import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/features/dashboard/sidebar/app-sidebar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
        <AppSidebar/>
        
        <SidebarInset>
            {children}
        </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;