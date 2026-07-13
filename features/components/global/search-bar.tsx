import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export const SearchBar = ({ value, onSearchChange, placeholder = "Search business, email or address..." }: SearchBarProps) => {
    return (
        <div className="relative md:w-md lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
                type="text"
                value={value}
                onChange={onSearchChange}
                placeholder={placeholder}
                className="block w-full pl-10 px-5 py-2.5 border border-slate-200 rounded-lg bg-white text-sm placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
        </div>
    );
};