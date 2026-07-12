import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate range of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#2B3038] text-xs font-semibold text-[#9CA3AF]">
      {/* Left: Row Size selector & Counts */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 px-2 bg-[#0F1115] border border-[#2B3038] rounded-lg text-xs font-bold text-white outline-none focus:border-[#F59E0B] cursor-pointer"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {totalItems > 0 ? (
          <span>
            Showing <span className="text-white">{startItem}</span> - <span className="text-white">{endItem}</span> of <span className="text-white">{totalItems}</span> assets
          </span>
        ) : (
          <span>No assets to display</span>
        )}
      </div>

      {/* Right: Page Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg border border-[#2B3038] hover:border-slate-700 bg-[#0F1115] hover:text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:border-[#2B3038] disabled:hover:text-[#9CA3AF] cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>

          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                currentPage === num
                  ? 'bg-[#F59E0B] text-white'
                  : 'border border-[#2B3038] bg-[#0F1115] hover:border-slate-700 hover:text-white'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg border border-[#2B3038] hover:border-slate-700 bg-[#0F1115] hover:text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:border-[#2B3038] disabled:hover:text-[#9CA3AF] cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
