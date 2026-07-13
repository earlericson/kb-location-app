import { Import, Plus, RefreshCcw } from 'lucide-react'
import { ChangeEvent } from 'react'
import { SearchBar } from '../global/search-bar';

interface TableHeaderProps {
    searchTerm: string;
    onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAdd: () => void;
    onSync: () => void;
    onImport: () => void;
    draftCount: number;
    isSyncing: boolean;
    isLoading: boolean;
}

export const TableHeader = ({
    searchTerm, onSearchChange, onAdd, onSync, onImport, draftCount, isSyncing, isLoading

}: TableHeaderProps) => {

    return (
        <div className="max-w-7xl mx-auto pb-4 sm:pb-4 lg:px-2">
            <div className="flex flex-col-reverse md:flex-row md:items-center justify-between items-center gap-4">

                {/* Column 1: Searchbar */}
                <div className="flex relative">
                    <SearchBar
                        value={searchTerm}
                        onSearchChange={onSearchChange}
                    />
                </div>

                {/* Column 2: 3 Buttons / Actions */}
                <div className="flex md:flex-row md:items-start gap-1 sm:gap-2">

                    {/* Button 1: Add New */}
                    <button
                        onClick={onAdd}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        <Plus size={20} />
                        <span className="hidden lg:inline">Add New Location</span>
                    </button>

                    {/* Button 2: Sync */}
                    <button
                        onClick={onSync}
                        disabled={draftCount === 0 || isSyncing}
                        // onClick={handleSyncData}
                        className={`flex items-center justify-center gap-2  px-5 py-2.5 rounded-lg font-semibold transition-all
                        ${draftCount === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 cursor-pointer"
                            }`}
                    >
                        <RefreshCcw size={20} />
                        <span className="hidden lg:inline">Sync All</span>
                    </button>

                    {/* Button 2.1: Import */}
                    <button
                        onClick={onImport}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                        <Import size={20} />
                        <span className="hidden lg:inline">{isLoading ? "Fetching ..." : "Import"}</span>
                    </button>

                    {/* Button 3: Logout */}


                </div>
            </div>
        </div>
    )
}
