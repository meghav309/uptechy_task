import { useState } from 'react';
import { useCandidates } from '../hooks/useCandidates';
import ApiCandidateCard from '../components/ApiCandidateCard';
import SkeletonCard from '../components/SkeletonCard';
import CandidatePanel from '../components/CandidatePanel';
import Pagination from '../components/Pagination';
import { useApp } from '../context/AppContext';
import { Search, ChevronDown, AlertCircle, UserPlus } from 'lucide-react';

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ query, statusFilter }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200"
        className="w-44 h-36 mb-6 opacity-75" aria-hidden="true">
        <circle cx="120" cy="100" r="80" fill="currentColor" className="text-slate-200 dark:text-navy-800" />
        <line x1="168" y1="148" x2="192" y2="172" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-slate-400 dark:text-slate-600" />
        <circle cx="140" cy="120" r="36" fill="none" stroke="currentColor" strokeWidth="7" className="text-slate-300 dark:text-slate-600" />
        <circle cx="120" cy="88" r="16" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
        <path d="M88 128 Q88 108 120 108 Q152 108 152 128" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
        <line x1="106" y1="74" x2="112" y2="80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-cyan-400" />
        <line x1="112" y1="74" x2="106" y2="80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-cyan-400" />
        <line x1="128" y1="74" x2="134" y2="80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-cyan-400" />
        <line x1="134" y1="74" x2="128" y2="80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-cyan-400" />
      </svg>
      <h3 className="font-syne font-bold text-xl text-slate-700 dark:text-slate-300 mb-2">No candidates found</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-dm max-w-xs leading-relaxed">
        {query
          ? <>No results for "<span className="text-cyan-400 font-medium">{query}</span>". Try a different name.</>
          : statusFilter !== 'All'
          ? <>No candidates with status "<span className="text-cyan-400 font-medium">{statusFilter}</span>".</>
          : 'No candidates in the pipeline yet.'}
      </p>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ message }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-red-500 dark:text-red-400" />
      </div>
      <h3 className="font-syne font-semibold text-lg text-slate-700 dark:text-slate-300 mb-1">Failed to load candidates</h3>
      <p className="text-sm text-slate-400 font-dm">{message}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Candidates() {
  const { navigate } = useApp();
  const {
    candidates, filtered, loading, error, stats,
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    page, totalPages, goTo,
    updateStatus, STATUSES,
  } = useCandidates();

  const [panelCandidate, setPanelCandidate] = useState(null);

  const handlePanelStatusChange = (id, status) => {
    updateStatus(id, status);
    setPanelCandidate(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  return (
    <div className="page-enter space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne font-bold text-3xl text-slate-900 dark:text-white">Candidates</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-dm mt-1">
            {loading ? 'Fetching candidates…' : `${filtered.length} of ${stats.total} candidates`}
          </p>
        </div>
        <button id="header-add-candidate" onClick={() => navigate('add-candidate')}
          className="btn-primary self-start sm:self-auto flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Candidate
        </button>
      </div>

      {/* ── Mini stats strip ── */}
      {!loading && !error && (
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Applied',     count: stats.applied,     color: 'text-blue-400' },
            { label: 'Shortlisted', count: stats.shortlisted, color: 'text-emerald-400' },
            { label: 'Interview',   count: stats.interview,   color: 'text-violet-400' },
            { label: 'Rejected',    count: stats.rejected,    color: 'text-red-400' },
          ].map(({ label, count, color }) => (
            <div key={label} className="glass-card px-4 py-2.5 flex items-center gap-2 animate-fade-in">
              <span className={`font-syne font-bold text-lg ${color}`}>{count}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-dm">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Search + filter bar ── */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input id="candidates-search" type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name…" className="input-field pl-10"
            aria-label="Search candidates by name" />
        </div>
        <div className="relative sm:w-48">
          <select id="candidates-status-filter" value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field appearance-none pr-9 cursor-pointer" aria-label="Filter by status">
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Card grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && candidates.length === 0 && (
          <EmptyState query={searchQuery} statusFilter={statusFilter} />
        )}
        {!loading && !error && candidates.map((candidate, i) => (
          <ApiCandidateCard key={candidate.id} candidate={candidate}
            delay={i * 50} statuses={STATUSES}
            onStatusChange={updateStatus}
            onView={setPanelCandidate} />
        ))}
      </div>

      {/* ── Pagination ── */}
      {!loading && !error && filtered.length > 0 && (
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} onPageChange={goTo} />
      )}

      {/* ── Slide-in panel ── */}
      {panelCandidate && (
        <CandidatePanel candidate={panelCandidate}
          onClose={() => setPanelCandidate(null)}
          onStatusChange={handlePanelStatusChange} />
      )}
    </div>
  );
}
