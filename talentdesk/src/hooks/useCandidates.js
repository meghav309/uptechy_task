import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCandidatesCtx } from '../context/CandidatesContext';

const PAGE_SIZE = 6;

/**
 * useCandidates
 * Thin hook around CandidatesContext that adds:
 * - Local search and status filter state
 * - Pagination (PAGE_SIZE cards per page)
 */
export function useCandidates() {
  const {
    allCandidates,
    loading,
    error,
    stats,
    STATUSES,
    updateCandidateStatus,
  } = useCandidatesCtx();

  const [searchQuery,  setSearchQuery]  = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page,         setPage]         = useState(1);

  // Reset to page 1 whenever search or filter changes
  useEffect(() => { setPage(1); }, [searchQuery, statusFilter]);

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = allCandidates;
    if (statusFilter !== 'All')
      list = list.filter(c => c.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [allCandidates, statusFilter, searchQuery]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);

  const candidates = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );

  const goTo = useCallback((p) => setPage(Math.min(Math.max(1, p), totalPages)), [totalPages]);

  return {
    candidates,      // current page
    filtered,        // full filtered list (for count display)
    loading,
    error,
    stats,
    STATUSES,
    searchQuery,  setSearchQuery,
    statusFilter, setStatusFilter,
    page: safePage, totalPages, goTo,
    updateStatus: updateCandidateStatus,
  };
}
