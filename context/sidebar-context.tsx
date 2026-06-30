"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const SidebarContext = createContext({
    isSidebarOpen: true,
    toggleSidebar: () => { },
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 2. Use useEffect to detect if we are on a mobile device on mount
    useEffect(() => {
        const handleResize = () => {
            // If screen is smaller than 1024px (lg breakpoint), set to false
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        };

        // Run once on mount
        handleResize();

        // Optional: add event listener if you want it to react to window resizing
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);