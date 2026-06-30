"use client"
import React from 'react';
import { Sidebar } from '@/features/components/main/sidebar';
import { SidebarProvider } from '@/context/sidebar-context';
import { MainContent } from '@/features/components/main/main-content';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <SidebarProvider>
                <div className="flex h-screen w-screen">
                    <Sidebar />
                    <MainContent>{children}</MainContent>
                </div>
            </SidebarProvider>
        </div>
    );
}