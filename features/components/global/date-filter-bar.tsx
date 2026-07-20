import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface FilterBarProps {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (dates: [Date | null, Date | null]) => void;
}

export const DateFilterBar = ({ startDate, endDate, onChange }: FilterBarProps) => (
    <div className="flex justify-end mb-4">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                <Calendar size={14} className="text-slate-400" />
            </div>

            <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={onChange}
                placeholderText="Select date range"
                className="block w-full pl-10 px-5 py-2.5 border border-slate-200 rounded-lg bg-white text-sm placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
        </div>
    </div>
);