"use client";

import { RefreshCw } from "lucide-react";

interface SyncModalProps {
    isOpen: boolean;
    BusinessName: string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export const SyncSingleModal = ({ isOpen, BusinessName, onClose, onConfirm, isLoading }: SyncModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Box */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-indigo-50 rounded-full">
                            <RefreshCw
                                className={`text-emerald-600 ${isLoading ? 'animate-spin' : ''}`}
                                size={24}
                            />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Location Sync</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                        Are you sure you want to publish <span className="font-semibold text-gray-800">{BusinessName}</span> location?
                        It will appear on the live map immediately.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex px-6 py-2 gap-1 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw size={18} className="animate-spin" />
                                <span>Syncing...</span>
                            </>
                        ) : (
                            "Start Sync"
                        )}
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