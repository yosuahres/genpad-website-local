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

  const handlePageUpdate = (newPage: number) => {
    const clampedPage = Math.max(1, Math.min(newPage, displayTotalPages));
    onPageChange(clampedPage);
  };

  // Shared button styles: No rounding, no gap, borders collapse with -ml-px
  const btnClass = "p-2 border border-slate-300 rounded-none bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm -ml-px first:ml-0 relative z-10 hover:z-20";

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-200">
      <div className="flex items-center">
        <button
          onClick={() => handlePageUpdate(currentPage - 5)}
          className={btnClass}
          disabled={currentPage === 1}
          title="Back 5 pages"
        >
          <ChevronsLeft size={16} className="text-slate-600" />
        </button>

        <button
          onClick={() => handlePageUpdate(currentPage - 1)}
          className={btnClass}
          disabled={currentPage === 1}
          title="Previous page"
        >
          <ChevronLeft size={16} className="text-slate-600" />
        </button>

        <div className="flex items-center justify-center min-w-[40px] h-9 border-y border-slate-300 bg-blue-500 -ml-px relative z-10">
          <span className="text-sm font-bold text-white">{currentPage}</span>
        </div>

        <button
          onClick={() => handlePageUpdate(currentPage + 1)}
          className={btnClass}
          disabled={currentPage === displayTotalPages}
          title="Next page"
        >
          <ChevronRight size={16} className="text-slate-600" />
        </button>

        <button
          onClick={() => handlePageUpdate(currentPage + 5)}
          className={btnClass}
          disabled={currentPage === displayTotalPages}
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