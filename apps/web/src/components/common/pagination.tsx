// components/common/pagination.tsx
import { Dispatch, SetStateAction } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: Dispatch<SetStateAction<number>> | ((page: number) => void);
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems,
  onPageChange 
}: PaginationProps) {
  const displayTotalPages = totalPages <= 0 ? 1 : totalPages;

  // Helper to ensure we don't go out of bounds
  const handlePageUpdate = (newPage: number) => {
    const clampedPage = Math.max(1, Math.min(newPage, displayTotalPages));
    onPageChange(clampedPage);
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-200">
      {/* Left Side: Navigation */}
      <div className="flex items-center gap-2">
        {/* Skip 5 Back */}
        <button
          disabled={currentPage <= 1}
          onClick={() => handlePageUpdate(currentPage - 5)}
          className="p-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
          title="Back 5 pages"
        >
          <ChevronsLeft size={16} className="text-slate-600" />
        </button>

        {/* Prev 1 */}
        <button
          disabled={currentPage <= 1}
          onClick={() => handlePageUpdate(currentPage - 1)}
          className="p-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
          title="Previous page"
        >
          <ChevronLeft size={16} className="text-slate-600" />
        </button>

        <div className="flex items-center justify-center min-w-[40px] h-9">
          <span className="text-sm font-bold text-black">{currentPage}</span>
        </div>

        <button
          disabled={currentPage >= displayTotalPages}
          onClick={() => handlePageUpdate(currentPage + 1)}
          className="p-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
          title="Next page"
        >
          <ChevronRight size={16} className="text-slate-600" />
        </button>

        <button
          disabled={currentPage >= displayTotalPages}
          onClick={() => handlePageUpdate(currentPage + 5)}
          className="p-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
          title="Forward 5 pages"
        >
          <ChevronsRight size={16} className="text-slate-600" />
        </button>
      </div>

      <div className="text-sm text-slate-500 font-medium">
        Page <span className="text-black font-bold">{currentPage}</span> of <span className="text-black font-bold">{displayTotalPages}</span>
        <span className="ml-2 text-slate-400">({totalItems} total items)</span>
      </div>
    </div>
  );
}