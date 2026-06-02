"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import this
import { MoreHorizontal } from 'lucide-react';

interface MenuOption {
    label: string;
    path?: string;
}

interface ActionMenuProps {
    options: MenuOption[];
}


export const ActionMenu = ({ options }: ActionMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
                <MoreHorizontal size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 px-4 py-2 w-40 bg-white rounded-sm shadow-lg border border-gray-100 z-50 ">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (option.path) router.push(option.path);
                                setIsOpen(false);
                            }}
                            className='text-gray-400 hover:text-gray-700'
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};