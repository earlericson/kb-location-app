"use client";

import { useScrollLock } from "@/hooks/use-scroll-lock";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    businessName: string;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, isLoading, businessName }: ConfirmModalProps) => {

    // Lock scroll if modal is open
    useScrollLock(!!isOpen);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Box */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 rounded-full text-red-600">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Delete This Location?</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">This action cannot be undone. The <span className="font-semibold text-gray-800">{businessName}</span> location and its map marker will be permanently removed.</p>
                </div>

                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? "Deleting..." : "Confirm Delete"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}