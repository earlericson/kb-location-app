"use client";

import { useBusinessQuery } from "@/hooks/use-business-query";
import { useBusinessMutations } from "@/hooks/use-business-mutation";
import { BusinessLocation } from "@/types/business";
import ConfirmModal from "../component/modal/delete-confirm-modal";
// Import Lucide Icons
import {
    Globe,
    FileText,
    Pencil,
    Trash2
} from "lucide-react";
import { useState } from "react";

interface BusinessTableProps {
    onEdit: (business: BusinessLocation) => void;
}

export default function BusinessTable({ onEdit }: BusinessTableProps) {
    const { data: businesses, isLoading, isError } = useBusinessQuery();
    const { deleteBusiness, isDeleting } = useBusinessMutations();


    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const openDeleteModal = (id: string) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId) {
            await deleteBusiness(selectedId);
            setIsDeleteModalOpen(false);
            setSelectedId(null);
        }
    };

    if (isLoading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-700">Business Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-700">Contact Info</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-700">Coordinates</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Links</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {businesses?.map((business: BusinessLocation) => (
                        <tr key={business.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{business.businessName}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                <div>{business.email}</div>
                                <div className="text-slate-400">{business.phone}</div>
                                <div>{business.address}</div>
                            </td>

                            <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                {business.latitude}, {business.longitude}
                            </td>

                            {/* LINKS COLUMN WITH ICONS */}
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                    {business.websiteUrl && (
                                        <a
                                            href={business.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                            title="Visit Website"
                                        >
                                            <Globe size={18} />
                                        </a>
                                    )}
                                    {business.contentUrl && (
                                        <a
                                            href={business.contentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                                            title="View Content Source"
                                        >
                                            <FileText size={18} />
                                        </a>
                                    )}
                                </div>
                            </td>

                            {/* ACTIONS COLUMN */}
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                        onClick={() => onEdit(business)} // We can wire this to open your drawer
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => business.id && openDeleteModal(business.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* The Popup Box */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Delete Business?"
                message="This action cannot be undone. This business and its map marker will be permanently removed from the database."
            />
        </div>
    );
}