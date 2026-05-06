"use client";

import React, { useState, useMemo } from "react";
import { useBusinessQuery } from "@/hooks/use-business-query";
import { useBusinessMutations } from "@/hooks/use-business-mutation";
import { BusinessLocation } from "@/types/business";
import { SyncSingleModal } from "../components/modal/sync-single-confirm-modal";
import ConfirmModal from "../components/modal/delete-confirm-modal";
// Import Lucide Icons
import {
    Search,
    Globe,
    FileText,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Phone,
    Mail,
    MapPin,
    RefreshCcw,
    Map
} from "lucide-react";
import TableImage from "../components/table/table-image";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

interface BusinessTableProps {
    onEdit: (business: BusinessLocation) => void;
}

export default function BusinessTable({ onEdit }: BusinessTableProps) {

    // State to track which specific location is being confirmed
    const [pendingLocation, setPendingLocation] = useState<{ id: string, businessName: string } | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const { data: businesses, isLoading, isError } = useBusinessQuery();
    const { deleteBusiness, isDeleting } = useBusinessMutations();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Logic to filter businesses based on search term
    const filteredBusinesses = useMemo(() => {
        if (!businesses) return [];

        return businesses.filter((business) => {
            const searchStr = searchTerm.toLowerCase();
            return (
                business.businessName?.toLowerCase().includes(searchStr) ||
                business.address?.toLowerCase().includes(searchStr) ||
                business.email?.toLowerCase().includes(searchStr)
            );
        });
    }, [searchTerm, businesses]);

    // 2. Pagination logic
    const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBusinesses.slice(start, start + itemsPerPage);
    }, [filteredBusinesses, currentPage]);

    // Reset to page 1 when searching
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };


    // 2. NEW: Calculate the sliding window of 5 pages
    const getVisiblePages = () => {
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        // Adjust if we are near the end of the list
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const visiblePages = getVisiblePages();


    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const openDeleteModal = (id: string) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId) {
            try {
                await deleteBusiness(selectedId);

                // Success notification
                toast.success("Location was deleted successfully!");

                // Close modal only after success
                setIsDeleteModalOpen(false);
                setSelectedId(null);
            } catch (error) {
                console.error("Delete Error:", error);

                // Error notification
                toast.error("Failed to delete location. Please try again.");

                // Optionally keep the modal open so they can try again
            }
        }
    };

    if (isLoading) return <div className="p-12 text-center">Loading...</div>;


    // Individual location sync

    const handleSingleSync = async () => {
        if (!pendingLocation) return;

        setIsSyncing(true);
        try {
            await updateDoc(doc(db, "locations", pendingLocation.id), {
                status: "published"
            });
            toast.success(`${pendingLocation.businessName} is now live!`);
            setPendingLocation(null); // This closes the modal
        } catch (error) {
            console.error("Sync error:", error);
            toast.error("Failed to publish.");
        } finally {
            setIsSyncing(false);
        }

        // try {
        //     // No loading toast, as requested
        //     const docRef = doc(db, "locations", id);

        //     await updateDoc(docRef, {
        //         status: "published",
        //         syncedAt: new Date().toISOString()
        //     });

        //     toast.success(`${name} is now live!`);
        // } catch (error) {
        //     console.error("Single Sync Error:", error);
        //     toast.error("Failed to publish location.");
        // }
    };

    return (

        <div className="flex flex-col">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-slate-100 bg-slate-50/50">

                {/* Search Bar Section */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search name, address, or email..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Right Side: View Map & Sync Buttons */}
                <div className="flex items-center gap-3">
                    <a
                        href="/map" // Or use Link from next/link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <Map size={18} className="text-gray-700" />
                        View Map
                    </a>
                </div>

            </div>


            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Image</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Business Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Contact Info</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Coordinates</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Links</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((loc) => (
                                <tr key={loc.id} className="hover:bg-slate-50/50 transition-colors">

                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                            <TableImage
                                                src={loc.imageUrl}
                                                alt={loc.businessName}
                                            />
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{loc.businessName || loc.name}</div>
                                        <div className="text-sm font-medium text-slate-500">{loc.businessOwner}</div>
                                    </td>

                                    <td className="px-6 py-4 space-y-1.5">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail size={14} className="text-blue-500/70" />
                                            {loc.email || "No email"}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone size={14} className="text-green-600/70" />
                                            <span>{loc.phone || "No phone"}</span>
                                        </div>

                                        <div className="flex items-start gap-2 text-sm text-slate-600">
                                            <MapPin size={14} className=" text-slate-400 mt-0.5 shrink-0" />
                                            <span>{loc.address}</span>
                                        </div>
                                    </td>



                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                        <div><label>Lat:</label> {loc.latitude}</div>
                                        <div>
                                            <label>Long:</label> {loc.longitude}
                                        </div>
                                    </td>

                                    {/* LINKS COLUMN WITH ICONS */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            {loc.websiteUrl && (
                                                <a
                                                    href={loc.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-slate-400 hover:text-blue-600 transition-colors"
                                                    title="Visit Website"
                                                >
                                                    <Globe size={18} />
                                                </a>
                                            )}
                                            {loc.contentUrl && (
                                                <a
                                                    href={loc.contentUrl}
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

                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${loc.status === "published"
                                                ? "bg-emerald-50 text-emerald-600  border-emerald-200"
                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                                }`}>
                                                {/* Dot indicator for extra visual cue */}
                                                <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${loc.status === "published" ? "bg-emerald-600" : "bg-amber-500"
                                                    }`}></span>
                                                {loc.status.charAt(0).toUpperCase() + loc.status.slice(1)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* ACTIONS COLUMN */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-1">
                                            {loc.status === "draft" ? (
                                                <button
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                                    onClick={() => setPendingLocation({ id: loc.id, businessName: loc.businessName })}
                                                    title="Sync"
                                                >
                                                    <RefreshCcw size={18} />
                                                </button>
                                            ) : null}
                                            <button
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                onClick={() => onEdit(loc)} // We can wire this to open your drawer
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => loc.id && openDeleteModal(loc.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    No businesses found matching
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Navigation */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100">
                <div className="text-sm text-slate-500">
                    Showing <span className="font-semibold text-slate-700">
                        {filteredBusinesses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                    </span> to <span className="font-semibold text-slate-700">
                        {Math.min(currentPage * itemsPerPage, filteredBusinesses.length)}
                    </span> of <span className="font-semibold text-slate-700">{filteredBusinesses.length}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Left Arrow */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1">
                        {/* ONLY MAP THROUGH VISIBLE PAGES */}
                        {visiblePages.map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-8 h-8 text-sm font-medium rounded-md transition-all ${currentPage === page
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {pendingLocation && (
                <SyncSingleModal
                    isOpen={!!pendingLocation}
                    BusinessName={pendingLocation.businessName}
                    onClose={() => setPendingLocation(null)}
                    onConfirm={handleSingleSync}
                    isLoading={isSyncing}
                />
            )}
            {/* The Popup Box */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}