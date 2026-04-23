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
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
            <LogOut size={18} />
            <span>Sign Out</span>
        </button>
    );
};