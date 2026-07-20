'use client';
import { useEffect, useState } from 'react';
import { Globe, Import, Mail, MapPin, Phone, User, X } from 'lucide-react';
import { MappedLocation } from '@/types/location';

interface Props {
  data: MappedLocation[];
  existingIds: string[];
  onConfirm: (selectedItems: MappedLocation[]) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function ImportStagingTable({ data, existingIds, onConfirm, onCancel, isSaving }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Lock background scroll on mount, unlock on unmount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // const toggleAll = (): void => {
  //   setSelectedIds(selectedIds.length === data.length ? [] : data.map(i => i.ghlId));
  // };

  // Filter out already imported items when "Select All" is clicked
  const toggleAll = (): void => {
    const importable = data.filter(item => !existingIds.includes(item.ghlId));
    setSelectedIds(selectedIds.length === importable.length ? [] : importable.map(i => i.ghlId));
  };

  // const toggleOne = (id: string): void => {
  //   setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  // };
  const toggleOne = (id: string): void => {
    if (existingIds.includes(id)) return; // Prevent selection
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    // Fixed Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">

      {/* Modal Container */}
      <div className="bg-white w-full max-w-7xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-6 bg-gray-50 flex justify-between items-center border-b border-gray-200">
          <div>
            <h3 className="text-md md:text-xl font-bold text-gray-900">Review GHL Import</h3>
            <p className="text-sm text-gray-500">{selectedIds.length} of {data.length} selected for import</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={selectedIds.length === 0 || isSaving}
              onClick={() => onConfirm(data.filter(i => selectedIds.includes(i.ghlId)))}
              className="flex items-center gap-2 bg-amber-700 text-white px-5 py-2.5 rounded-lg font-bold disabled:opacity-50 hover:bg-amber-800 transition-all shadow-sm"
            >
              {isSaving ? 'Importing...' : <><Import size={18} /> <span className="hidden md:inline">Import Selected</span></>}
            </button>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-white sticky top-0 z-10 shadow-sm">
              <tr className="text-gray-600 uppercase text-[11px] tracking-wider">
                <th className="p-5 w-12"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-amber-700 cursor-pointer transition-all" onChange={toggleAll} checked={selectedIds.length === data.length} /></th>
                <th className="p-5 font-bold">Business Name</th>
                <th className="p-5 font-bold">Contact Info</th>
                <th className="p-5 font-bold">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(item => {

                const isAlreadyImported = existingIds.includes(item.ghlId);

                return (
                  <tr
                    key={item.ghlId}
                    // onClick={() => toggleOne(item.ghlId)}
                    onClick={() => !isAlreadyImported && toggleOne(item.ghlId)}
                    // className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    className={`transition-colors border-b border-gray-50 ${isAlreadyImported
                      ? 'bg-gray-50/50 cursor-not-allowed opacity-70'
                      : 'hover:bg-indigo-50/30 cursor-pointer group'
                      }`}

                  >
                    <td className="p-5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        disabled={isAlreadyImported}
                        className={`w-4 h-4 rounded border-gray-300 accent-amber-700 transition-all ${isAlreadyImported ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'
                          }`}
                        checked={selectedIds.includes(item.ghlId)}
                        // onChange={() => toggleOne(item.ghlId)} 
                        onChange={() => !isAlreadyImported && toggleOne(item.ghlId)}
                      />
                    </td>
                    <td className="flex flex-col p-5 leading-relaxed">
                      <span className={`font-semibold transition-colors ${isAlreadyImported ? 'text-gray-400' : 'text-gray-800'
                        }`} >
                        {item.businessName}
                      </span>
                      <span className={`flex items-center gap-1.5 text-[11px] font-mono mt-0.5 ${isAlreadyImported ? 'text-gray-300' : 'text-gray-600'}`}><User size={12} />{item.businessOwner}
                      </span>
                    </td>
                    <td className='p-5 text-gray-600 leading-relaxed'>
                      <span className={`flex items-center gap-1.5 ${isAlreadyImported ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Mail size={12} />{item.email || 'No Email'}
                      </span>
                      <span className={`flex items-center gap-1.5 ${isAlreadyImported ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Phone size={12} />{item.phone || 'No Phone'}
                      </span>
                      <span className={`flex items-center gap-1.5 ${isAlreadyImported ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Globe size={12} />{item.websiteUrl || 'No Website'}
                      </span>
                    </td>
                    <td className="p-5 text-gray-600 leading-relaxed italic">
                      <span className={`flex items-center gap-1.5 ${isAlreadyImported ? 'text-gray-300' : 'text-gray-600'}`}>
                        <MapPin size={12} /> {item.address || 'No Address'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}