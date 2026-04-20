"use client";

import { Info, X } from "lucide-react";

interface UpdateConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function UpdateConfirmModal({ isOpen, onClose, onConfirm, isLoading }: UpdateConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Info size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Save Changes?</h3>
                    <p className="text-slate-600 mt-2">
                        Are you sure you want to update this business? These changes will be reflected immediately on the map and dashboard.
                    </p>
                </div>

                <div className="flex flex-col gap-2 p-6 pt-0">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? "Updating..." : "Yes, Update Details"}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}