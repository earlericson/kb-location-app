"use client";

import { BusinessLocation } from "@/types/business";
import { SyncSingleModal } from "../modal/sync-single-confirm-modal";
// import ConfirmModal from "../components/modal/delete-confirm-modal";
// Import Lucide Icons
import {
    Globe,
    FileText,
    Pencil,
    Trash2,
    Phone,
    Mail,
    MapPin,
    RefreshCcw,
    User,
    Eye
} from "lucide-react";
import TableImage from "./table-image";
import { STATUS_DISPLAY_MAP, STATUS_DISPLAY_MAP2, statusStyles } from "../../map/components/map-marker-color";
import { useLocationActions } from "@/hooks/use-location-action";
import { ConfirmModal } from "../modal/delete-confirm-modal";
import { LocationDetailsModal } from "./table-details-modal";
import { formatDate } from "@/lib/time/date-formatter";

interface BusinessTableProps {
    onEdit: (business: BusinessLocation) => void;
    data: BusinessLocation[]
}

export default function DashboardPage({ onEdit, data }: BusinessTableProps) {

    const {
        handleViewOnMap,
        // openDeleteModal,
        handleConfirmDelete,
        handleSingleSync,
        isSyncing,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        pendingLocation,
        setPendingLocation,
        isDeleting,
        detailsLocation,
        setDetailsLocation
    } = useLocationActions();

    return (

        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left md:table-fixed border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-4 text-sm font-semibold text-slate-700">Image</th>
                            <th className="px-4 py-4 text-sm font-semibold text-slate-700">Business Name</th>
                            <th className="px-4 py-4 text-sm font-semibold text-slate-700 text-center">Links</th>
                            <th className="px-4 py-4 text-sm font-semibold text-slate-700 text-center">Status</th>
                            <th className="px-4 py-4 text-sm font-semibold text-slate-700 text-center">Created</th>
                            <th className="px-4 py-4 text-sm font-semibold text-slate-700 text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length > 0 ? (
                            data.map((loc) => {
                                // Logic: Centralized configuration lookup
                                const config = statusStyles[loc.status as keyof typeof statusStyles] || {
                                    textBadge: 'bg-gray-50 text-gray-600 border-gray-200',
                                    dot: 'bg-gray-400'
                                };
                                return (
                                    <tr key={loc.id} className="hover:bg-slate-50/50 transition-colors">

                                        <td className="px-4 py-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                                <TableImage
                                                    src={loc.imageUrl}
                                                    alt={loc.businessName}
                                                />
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="text-[14px] font-normal text-slate-900">{loc.businessName || "Unnamed Business"}</div>
                                            <div className="flex items-start gap-1.5 text-[11px] text-slate-500 font-mono mt-1 leading-3.5"><User size={10} className="text-slate-500 mt-0.5 shrink-0" />{loc.businessOwner || "No Owner"}</div>
                                        </td>

                                        {/* LINKS COLUMN WITH ICONS */}
                                        <td className="px-4 py-4">
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

                                        <td className="px-4 py-4">
                                            <div className="flex justify-center">

                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.textBadge}`}>
                                                    {/* Dot indicator */}
                                                    <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${config.dot}`}></span>
                                                    {/* {loc.status} */}
                                                    {loc.status !== 'draft'
                                                        ? (STATUS_DISPLAY_MAP[loc.status] || loc.status)
                                                        : (STATUS_DISPLAY_MAP2[loc.status] || loc.status)
                                                    }
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-[14px] font-normal text-slate-900">
                                                {formatDate(loc.createdAt)}
                                            </span>
                                        </td>

                                        {/* ACTIONS COLUMN */}
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-1">

                                                {loc.status !== 'draft' ? (

                                                    loc.isSynced ? (
                                                        <button
                                                            onClick={() => handleViewOnMap(loc)}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                                            title="View on Map"
                                                        >
                                                            <MapPin size={18} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                                                            onClick={() => setPendingLocation(loc)}
                                                            title="Sync to Map"
                                                        >
                                                            <RefreshCcw size={18} />
                                                        </button>
                                                    )
                                                ) : null}

                                                <button
                                                    className="p-2 text-slate-400 hover:text-violet-700 hover:bg-violet-200 rounded-lg transition-colors cursor-pointer"
                                                    onClick={() => setDetailsLocation(loc)}
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                <button
                                                    className="p-2 text-slate-400 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                                                    onClick={() => onEdit(loc)} // We can wire this to open your drawer
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => loc.id && setIsDeleteModalOpen(loc)}
                                                    className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                                    No businesses found matching
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {detailsLocation && (
                <LocationDetailsModal
                    location={detailsLocation}
                    isOpen={!!detailsLocation}
                    onClose={() => setDetailsLocation(null)}
                    // onEdit={() => onEdit(detailsLocation)}
                    onEdit={() => {
                        setDetailsLocation(null);
                        onEdit(detailsLocation);
                    }}
                />
            )}

            {pendingLocation && (
                <SyncSingleModal
                    businessName={pendingLocation.businessName}
                    isOpen={!!pendingLocation}
                    onClose={() => setPendingLocation(null)}
                    onConfirm={handleSingleSync}
                    isLoading={isSyncing}
                />
            )}
            {/* The Popup Box */}
            {/* <ConfirmModal
                isOpen={!!isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(null)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}

            /> */}
            {isDeleteModalOpen && (
                <ConfirmModal
                    businessName={isDeleteModalOpen.businessName}
                    isOpen={!!isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(null)}
                    onConfirm={() => handleConfirmDelete(isDeleteModalOpen, () => setIsDeleteModalOpen(null))}
                    isLoading={isDeleting} // Ensure 'isDeleting' is a state you manage in your hook or component
                />
            )}

        </div>
    );
}