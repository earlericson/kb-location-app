"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    MapPin,
    List,
    PlusCircle,
    Tags,
    Activity,
    Settings,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    FileEdit,
    LogOut,
    Menu,
    Map
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLocationsOpen, setIsLocationsOpen] = useState(true);

    // 1. Defined Navigation Array
    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        {
            name: 'Locations',
            icon: MapPin,
            isParent: true,
            children: [
                { name: 'All Locations', href: '/dashboard/locations', icon: List },
                { name: 'Published', href: '/dashboard/locations/published', icon: CheckCircle2 },
                { name: 'Drafts', href: '/dashboard/locations/drafts', icon: FileEdit },
                { name: 'Add New', href: '/dashboard/locations/add', icon: PlusCircle },
            ]
        },
        { name: 'My Map', href: '/dashboard/maps', icon: Map },
        { name: 'Activity Logs', href: '/dashboard/logs', icon: Activity },
        { name: 'Signout', href: '/dashboard/settings', icon: LogOut },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 text-slate-800 ">
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-100 flex flex-col fixed h-full transition-all duration-300 shadow-sm z-10`}>

                <div className={`h-16 flex items-center border-b border-gray-100 px-4 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>

                    {/* Brand Name: Only visible when sidebar is open */}
                    {isSidebarOpen && (
                        <span className="font-bold text-xl text-slate-700 truncate px-2">
                            KB Map App
                        </span>
                    )}

                    {/* Toggle Button */}
                    <div className="h-16 flex items-center justify-center border-b border-gray-100">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                            {isSidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
                        </button>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        // PARENT ITEMS (Locations)
                        if (item.isParent) {
                            return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => isSidebarOpen && setIsLocationsOpen(!isLocationsOpen)}
                                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={20} />
                                            {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                                        </div>
                                        {isSidebarOpen && (isLocationsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                    </button>

                                    {isSidebarOpen && isLocationsOpen && (
                                        <div className="ml-6 mt-1 space-y-1 border-l border-gray-100">

                                            {/* Submenu Children Mapping */}
                                            {item.children?.map((child) => {
                                                const ChildIcon = child.icon;
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={`
        flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200
        ${pathname === child.href
                                                                ? 'text-blue-600 font-semibold bg-blue-50/50'
                                                                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                                            }
      `}
                                                    >
                                                        <ChildIcon size={16} />
                                                        <span>{child.name}</span>
                                                    </Link>
                                                );
                                            })}


                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // REGULAR ITEMS
                        return (
                            <Link key={item.name} href={item.href || "#"} className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                                <Icon size={20} />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}