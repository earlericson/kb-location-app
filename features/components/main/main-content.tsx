"use client";

import { useSidebar } from "@/context/sidebar-context";


export const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useSidebar();
  
  return (
    // <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
    //   {children}
    // </main>
    <main className={`flex-1 min-w-0 w-full transition-all duration-300
        ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} pl-20
    `}>
      <div className="w-full min-h-screen bg-gray-50 p-0 md:p-6"> {/* Full width container */}
        {children}
      </div>
    </main>
  );
};