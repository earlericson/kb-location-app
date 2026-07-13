// "use client"

import { ActivityLog } from '@/types';
import { Clock, Delete, Import, MapPin, MessageCircle, MessageCircleMore, MessageSquare, Pencil, Plus, RefreshCcw, Trash, User } from 'lucide-react';
import React from 'react';

interface ActivityLogsTable {
  logs: ActivityLog[];
  isLoading: boolean;
}

const ACTION_CONFIG = {
  Created: { icon: Plus, bg: 'bg-blue-100', text: 'text-blue-800' },
  Updated: { icon: Pencil, bg: 'bg-amber-100', text: 'text-amber-800' },
  Deleted: { icon: Trash, bg: 'bg-red-100', text: 'text-red-800' },
  Synced: { icon: RefreshCcw, bg: 'bg-emerald-100', text: 'text-emerald-800' },
  Imported: { icon: Import, bg: 'bg-gray-100', text: 'text-gray-800' },
};

export const ActivityLogsTable: React.FC<ActivityLogsTable> = ({ logs, isLoading }) => {
  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading activity logs...</div>;
  }

  if (logs.length === 0) {
    return <div className="p-4 text-center text-gray-500">No activity logs found.</div>;
  }

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';

    const date = timestamp.toDate();

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
      <div className=" bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Date</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Business Name</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Details</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-center">Performed By</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => {

              // Consolidated logic using the config object
              const config = ACTION_CONFIG[log.action as keyof typeof ACTION_CONFIG] || {
                icon: RefreshCcw, bg: 'bg-gray-100', text: 'text-gray-800'
              };
              const Icon = config.icon;

              return (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-900">
                    <div className="flex items-start gap-2">
                      <Clock size={12} className='mt-1 shrink-0 text-gray-400' /> {formatTimestamp(log.timestamp)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-medium">
                    <div className="flex items-start gap-2">
                      <MapPin size={12} className='mt-1 shrink-0 text-gray-400' /> {log.businessName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-medium italic">
                    <div className="flex items-start gap-2">
                      <MessageCircleMore size={12} className='mt-1 shrink-0 text-gray-400' /> {log.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900">
                    <div className="flex items-start gap-2 justify-center">
                      <User size={12} className='mt-1 shrink-0 text-gray-400' />Admin
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <span className={`flex w-fit items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} capitalize`}>
                        <Icon size={12} className="shrink-0" />
                        {log.action}
                      </span>
                    </div>
                  </td>
                </tr>
              )

            })}
          </tbody>
        </table>
      </div>
  );
};