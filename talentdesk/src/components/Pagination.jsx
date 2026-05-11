import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination
 * @param {number}   page        - current page (1-indexed)
 * @param {number}   totalPages
 * @param {number}   totalItems  - total filtered items count
 * @param {Function} onPageChange - (newPage) => void
 */
export default function Pagination({ page, totalPages, totalItems, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build visible page numbers — max 5, centered on current page
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const left  = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    for (let i = left; i <= right; i++) range.push(i);

    // Prepend first + ellipsis
    if (left > 2) range.unshift('…', 1);
    else if (left === 2) range.unshift(1);

    // Append ellipsis + last
    if (right < totalPages - 1) range.push('…', totalPages);
    else if (right === totalPages - 1) range.push(totalPages);

    return range;
  };

  const btnBase = `
    flex items-center justify-center w-9 h-9 rounded-xl text-sm font-dm
    border transition-all duration-150 select-none
  `;
  const activeCls  = 'bg-cyan-500 border-cyan-500 text-navy-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)]';
  const inactiveCls = 'bg-white/70 dark:bg-navy-800/70 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-cyan-500/60 hover:text-cyan-500 dark:hover:text-cyan-400';
  const disabledCls = 'opacity-40 cursor-not-allowed border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 bg-white/40 dark:bg-navy-800/40';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 animate-fade-in">
      {/* Item count */}
      <p className="text-xs text-slate-400 dark:text-slate-500 font-dm">
        Showing{' '}
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          {Math.min((page - 1) * 6 + 1, totalItems)}–{Math.min(page * 6, totalItems)}
        </span>{' '}
        of <span className="font-semibold text-slate-600 dark:text-slate-300">{totalItems}</span> candidates
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          id="pagination-prev"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? disabledCls : inactiveCls}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((num, i) =>
          typeof num === 'string' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-slate-400 dark:text-slate-500 text-sm select-none">
              {num}
            </span>
          ) : (
            <button
              key={num}
              id={`page-btn-${num}`}
              onClick={() => onPageChange(num)}
              className={`${btnBase} ${num === page ? activeCls : inactiveCls}`}
              aria-label={`Page ${num}`}
              aria-current={num === page ? 'page' : undefined}
            >
              {num}
            </button>
          )
        )}

        {/* Next */}
        <button
          id="pagination-next"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? disabledCls : inactiveCls}`}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
