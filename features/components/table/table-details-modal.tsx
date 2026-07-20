import React from 'react';
import { FileText, Globe, Image, Info, X } from 'lucide-react';
import { BusinessLocation } from '@/types';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import TableImage from './table-image';
import { formatDate } from '@/lib/time/date-formatter';
import { STATUS_DISPLAY_MAP, STATUS_DISPLAY_MAP2, statusStyles } from '@/features/map/components/map-marker-color';

// Define the interface based on your data structure
interface TableDetailsProps {
  location: BusinessLocation; // Replace 'any' with your actual Location type/interface
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const LocationDetailsModal = ({ location, onClose, isOpen, onEdit }: TableDetailsProps) => {

  // Lock scroll if modal is open
  useScrollLock(!!isOpen);

  if (!isOpen) return null;

  const config = statusStyles[location.status as keyof typeof statusStyles] || {
    textBadge: 'bg-gray-50 text-gray-600 border-gray-200',
    dot: 'bg-gray-400'
  };

  // return (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

  //     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

  //     <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
  //       <button
  //         onClick={onClose}
  //         className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
  //       >
  //         <X size={20} />
  //       </button>

  //       <h2 className="text-xl font-bold mb-4">{location.businessName}</h2>

  //       <div className="space-y-3 text-sm">
  //         {location.imageUrl && (
  //           <img
  //             src={location.imageUrl}
  //             alt={location.businessName}
  //             className="w-full h-48 object-cover rounded-lg mb-4"
  //           />
  //         )}
  //         <div className="grid grid-cols-2 gap-4">
  //           <p><strong>Email:</strong><br />{location.email || 'N/A'}</p>
  //           <p><strong>Phone:</strong><br />{location.phone || 'N/A'}</p>
  //         </div>
  //         <p><strong>Address:</strong><br />{location.address}</p>
  //         <p><strong>Coordinates:</strong><br />{location.latitude}, {location.longitude}</p>
  //         <p><strong>Links:</strong><br />
  //           {location.websiteUrl ? (
  //             <a href={location.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
  //               Visit Website
  //             </a>
  //           ) : 'N/A'}
  //         </p>
  //         <div className="pt-2 border-t mt-2">
  //           <p><strong>Status:</strong> <span className="capitalize">{location.status}</span></p>
  //           <p><strong>Created:</strong> {location.createdAt?.toDate ? new Date(location.createdAt.toDate()).toLocaleDateString() : 'N/A'}</p>
  //           {/* <p><strong>Updated:</strong> {location.updatedAt?.toDate ? new Date(location.updatedAt.toDate()).toLocaleDateString() : 'N/A'}</p> */}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    // Backdrop with fixed positioning for cross-browser stability
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 " onClick={onClose} />

      {/* Modal container with responsive width */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-5xl my-auto overflow-hidden">

        {/* Header */}
        <div className="bg-gray-50 text-black px-6 py-2 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 rounded-full text-violet-600">
              <Info size={24} />
            </div>
            <h2 className="text-lg font-semibold truncate mr-4">Business Information</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body - Vertical stacking by default, grid on medium screens */}
        <div className="p-6 space-y-6 text-sm">

          {/* Business Overview */}
          <section>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex w-25 h-25 bg-gray-50 border  border-gray-200 rounded-xl shrink-0 items-center justify-center text-gray-400 text-[10px] text-center overflow-hidden">
                {location.imageUrl ? (
                  <div className="w-full h-full overflow-hidden bg-gray-50">
                    {/* <img
                      src={location.imageUrl}
                      alt={location.businessName}
                      className="w-full h-full object-cover"
                    /> */}
                    <TableImage
                      src={location.imageUrl}
                      alt={location.businessName}
                    />
                  </div>
                ) : (
                  // Fallback if no image exists
                  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 text-gray-400">
                    <Image size={42} />
                    <span className="text-[14px]">No image available</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 grow">
                <div>
                  <p className="text-slate-400 text-xs">Business Name</p>
                  {location.businessName ? (
                    <p className="font-medium pt-1">{location.businessName}</p>
                  ) : (
                    <p className="font-medium pt-1">None</p>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Owner</p>
                  {location.businessOwner ? (
                    <p className="font-medium pt-1">{location.businessOwner}</p>
                  ) : (
                    <p className="font-medium pt-1">None</p>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Email</p>
                  {location.email ? (
                    <p className="font-medium pt-1 break-all">{location.email}</p>
                  ) : (
                    <p className="font-medium pt-1">None</p>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Phone Number</p>
                  {location.phone ? (
                    <p className="font-medium pt-1">{location.phone}</p>
                  ) : (
                    <p className="font-medium pt-1">None</p>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Address</p>
                  {location.address ? (
                    <p className="font-medium pt-1">{location.address}</p>
                  ) : (
                    <p className="font-medium pt-1">None</p>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Coordinates</p>
                  <div>
                    <p className="font-medium pt-1">
                      <label className="text-xs">Lat: </label>
                      {location.latitude}
                    </p>
                    <p className="font-medium">
                      <label className="text-xs">Lng: </label>{location.longitude}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Website Url</p>
                  <div className="flex items-center justify-start gap-3 pt-1">
                    {location.websiteUrl ? (
                      <a
                        href={location.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-violet-600 transition-colors break-all"
                      >
                        {location.websiteUrl}
                      </a>
                    ) : (
                      <p className="font-medium pt-1">None</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Content Url</p>
                  <div className="flex items-center justify-start gap-3 pt-1">
                    {location.contentUrl ? (
                      <a
                        href={location.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-violet-600 transition-colors break-all"
                      >
                        {location.contentUrl}
                      </a>
                    ) : (
                      <p className="font-medium pt-1">None</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Status</p>
                  <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.textBadge}`}>
                    {/* Dot indicator */}
                    <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${config.dot}`}></span>
                    {/* {loc.status} */}
                    {location.status !== 'draft'
                      ? (STATUS_DISPLAY_MAP[location.status] || location.status)
                      : (STATUS_DISPLAY_MAP2[location.status] || location.status)
                    }
                  </span>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Created Date</p>
                  <p className="font-medium pt-1">{formatDate(location.createdAt)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Updated Date</p>
                  <p className="font-medium pt-1">
                    {location.updatedAt
                      ? formatDate(location.updatedAt)
                      : 'N/A'}
                  </p>
                </div>

              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 bg-slate-50">
          <button
            onClick={onEdit}
            // disabled={isLoading}
            className="flex px-6 py-2 gap-1 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Edit Details
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
};