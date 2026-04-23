"use client";

import { useAuth } from "@/context/auth-context";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();

            // Using window.location.href is faster for "Hard Resets" like Logout
            // it clears the memory and sends the user away immediately.
            window.location.href = "/login";

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-5 ml-1 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
            <LogOut size={18} />
            <span>Sign Out</span>
        </button>
    );
};