'use client';
import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { MappedLocation } from '@/types/location';


interface Props {
  data: MappedLocation[];
  onConfirm: (selectedItems: MappedLocation[]) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function ImportStagingTable({ data, onConfirm, onCancel, isSaving }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = (): void => {
    setSelectedIds(selectedIds.length === data.length ? [] : data.map(i => i.ghlId));
  };

  const toggleOne = (id: string): void => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden my-6">
      <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
        <div>
          <h3 className="font-bold text-gray-800">Review GHL Import</h3>
          <p className="text-xs text-gray-500">{selectedIds.length} of {data.length} selected</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><X size={20}/></button>
          <button 
            disabled={selectedIds.length === 0 || isSaving}
            onClick={() => onConfirm(data.filter(i => selectedIds.includes(i.ghlId)))}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50 hover:bg-blue-700"
          >
            {isSaving ? 'Importing...' : 'Add Selected'}
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white sticky top-0 shadow-sm">
            <tr>
              <th className="p-4 w-10"><input type="checkbox" onChange={toggleAll} checked={selectedIds.length === data.length} /></th>
              <th className="p-4 font-semibold">Business Name</th>
              <th className="p-4 font-semibold">Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.ghlId} className="border-t hover:bg-blue-50/50">
                <td className="p-4"><input type="checkbox" checked={selectedIds.includes(item.ghlId)} onChange={() => toggleOne(item.ghlId)} /></td>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4 text-gray-500">{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}