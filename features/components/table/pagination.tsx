import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    visiblePages: number[];
    onPageChange: (page: number) => void;
}

export const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    visiblePages,
    onPageChange,
}: PaginationProps) => {
    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 items-center justify-between px-6 py-4 bg-white border-t border-slate-100">
            <div className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-semibold text-slate-700">
                    {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-slate-700">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{' '}
                of <span className="font-semibold text-slate-700">{totalItems}</span>
            </div>

            <div className="flex items-center gap-2">
                {/* Left Arrow */}
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                    {visiblePages.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`min-w-8 h-8 text-sm font-medium rounded-md transition-all ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};