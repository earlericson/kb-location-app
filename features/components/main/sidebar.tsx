"use client"

import React, { useState } from 'react'
import { usePathname } from 'next/navigation';
import { Activity, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, FileEdit, LayoutDashboard, List, LogOut, LucideIcon, Map, MapPin, Menu, PlusCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '@/context/sidebar-context';
import { LogoutButton } from '@/features/auth/logout-btn';


interface NavItem {
    name: string;
    href?: string; // Optional because parents might just be toggles
    icon: LucideIcon;
    isParent?: boolean;
    children?: NavItem[]; // Recursively allows children
}

export const Sidebar = () => {
    const pathname = usePathname();
    // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const [isLocationsOpen, setIsLocationsOpen] = useState(true);

    // 1. Defined Navigation Array
    const navItems: NavItem[] = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        {
            name: 'Locations',
            icon: MapPin,
            isParent: true,
            children: [
                { name: 'All Locations', href: '/locations', icon: List },
                { name: 'Published', href: '/published', icon: CheckCircle2 },
                { name: 'Drafts', href: '/drafts', icon: FileEdit },
                { name: 'Add New', href: '/add', icon: PlusCircle },
            ]
        },
        { name: 'My Map', href: '/map', icon: Map },
        { name: 'Activity Logs', href: '/logs', icon: Activity },
    ];

    return (
        <>
            {/* Mobile Overlay: Only visible when sidebar is open on mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}


            {/* Sidebar Container */}
            <aside className={`bg-white border-r border-gray-100 flex flex-col fixed h-full transition-all duration-300 ease-in-out shadow-sm z-50
                ${isSidebarOpen ? 'w-64' : 'w-20'}
                
                `}>



                <div className={`h-16 flex items-center border-b border-gray-100 px-4 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>

                    {/* Brand Name: Only visible when sidebar is open */}
                    {isSidebarOpen && (
                        <span className="flex items-center gap-2 font-bold text-xl text-slate-700 truncate px-2">
                            <img src="https://firebasestorage.googleapis.com/v0/b/knockerball-map.firebasestorage.app/o/kblocations%2Fkb-logo.webp?alt=media&token=40a9618b-23d0-42d0-8727-c90f11c78b3f" alt="Knockerball logo" width={40} />
                            <div className='flex flex-col'>
                                <h1 className='text-xl leading-4'>Knockerball</h1><h6 className="text-sm font-mono font-normal leading-4 tracking-widest">Locations</h6>
                            </div>
                        </span>
                    )}

                    {/* Toggle Button */}
                    <div className="h-16 flex items-center justify-center border-b border-gray-100">
                        {/* <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                            {isSidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
                        </button> */}
                        <button onClick={toggleSidebar} className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">



                    {navItems.map((item) => {
                        const Icon = item.icon;

                        // PARENT ITEMS (Locations)
                        if (item.isParent) {
                            return (
                                <div key={item.name} title={!isSidebarOpen ? item.name : ""} className="w-full">
                                    <button
                                        onClick={() => setIsLocationsOpen(!isLocationsOpen)}
                                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={20} className="min-w-[20px]" />
                                            {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                                        </div>
                                        {isSidebarOpen && (isLocationsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                    </button>

                                    {/* Submenu Children Mapping: Always render, hide via CSS if needed */}
                                    {isLocationsOpen && (
                                        <div className={`mt-1 space-y-1 ${isSidebarOpen ? 'ml-6 border-l border-gray-100' : 'ml-0'}`}>
                                            {item.children?.map((child) => {
                                                const ChildIcon = child.icon;
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href ?? "#"}
                                                        title={!isSidebarOpen ? child.name : ""} // Native tooltip when collapsed
                                                        className={`
                                        flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200
                                        ${pathname === child.href
                                                                ? 'text-red-600 bg-red-50'
                                                                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                                            }
                                        ${!isSidebarOpen ? 'justify-center px-0' : ''}
                                    `}
                                                    >
                                                        <ChildIcon size={16} className="min-w-[16px]" />
                                                        {isSidebarOpen && <span>{child.name}</span>}
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
                            <Link
                                key={item.name}
                                href={item.href || "#"}
                                title={!isSidebarOpen ? item.name : ""}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === item.href
                                    ? 'bg-red-50 text-red-600'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                    } ${!isSidebarOpen ? 'justify-center' : ''}`}
                            >
                                <Icon size={20} className="min-w-[20px]" />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}

                    {/* LOGOUT BUTTON */}
                    <LogoutButton />
                </nav>
            </aside>
        </>
    )
}