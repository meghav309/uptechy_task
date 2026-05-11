import { useState } from 'react';
import { Mail, Phone, Eye, Building2 } from 'lucide-react';

const STATUS_STYLES = {
  Applied:     { badge: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',   dot: 'bg-blue-500' },
  Shortlisted: { badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  Interview:   { badge: 'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  Rejected:    { badge: 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400',       dot: 'bg-red-500' },
};

const SKILL_STYLES = {
  React:  'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  Node:   'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400',
  Python: 'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  Java:   'bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400',
  CSS:    'bg-pink-100 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400',
  Go:     'bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400',
};

/**
 * ApiCandidateCard
 * Displays a candidate fetched from DummyJSON with avatar image,
 * skill tag, colored status badge, and a View Details button.
 * @param {Function} onView  - called with the candidate object to open the panel
 */
export default function ApiCandidateCard({ candidate, delay = 0, onStatusChange, statuses, onView }) {
  const [imgError, setImgError] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const { badge, dot } = STATUS_STYLES[candidate.status] ?? STATUS_STYLES.Applied;
  const skillStyle = SKILL_STYLES[candidate.skill] ?? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';

  const initials = `${candidate.firstName?.[0] ?? ''}${candidate.lastName?.[0] ?? ''}`.toUpperCase();

  const handleViewDetails = () => onView?.(candidate);

  return (
    <div
      className="glass-card p-5 flex flex-col gap-4 opacity-0 animate-card-enter hover:shadow-xl dark:hover:shadow-black/30 hover:scale-[1.02] transition-transform duration-200"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* ── Top row: avatar + name + status ── */}
      <div className="flex items-start gap-3">
        {/* Avatar image or fallback */}
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-white/20 dark:ring-white/10">
          {!imgError ? (
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-syne font-bold text-sm">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-syne font-semibold text-sm text-slate-900 dark:text-white truncate">
            {candidate.name}
          </h3>
          {/* Skill tag */}
          <span className={`inline-flex items-center mt-1 text-[11px] font-medium font-dm px-2 py-0.5 rounded-full ${skillStyle}`}>
            {candidate.skill}
          </span>
        </div>

        {/* Status badge — click to cycle */}
        <div className="relative flex-shrink-0">
          <button
            id={`status-badge-${candidate.id}`}
            onClick={() => setStatusOpen((o) => !o)}
            className={`flex items-center gap-1.5 text-[11px] font-medium font-dm px-2.5 py-1 rounded-full ${badge} cursor-pointer hover:opacity-80 transition-opacity`}
            title="Click to change status"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
            {candidate.status}
          </button>

          {/* Status dropdown */}
          {statusOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 glass-card py-1.5 min-w-[130px] shadow-xl border border-white/10">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => { onStatusChange(candidate.id, s); setStatusOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-dm transition-colors
                    ${candidate.status === s
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-700/60'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Contact info ── */}
      <div className="space-y-1.5">
        <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-dm truncate">
          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400/70" />
          {candidate.email}
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-dm truncate">
          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400/70" />
          {candidate.phone}
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-dm truncate">
          <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400/70" />
          <span className="truncate">{candidate.college}</span>
        </p>
      </div>

      {/* ── View Details button ── */}
      <button
        id={`view-details-${candidate.id}`}
        onClick={handleViewDetails}
        className="mt-auto btn-primary w-full flex items-center justify-center gap-2 py-2"
      >
        <Eye className="w-3.5 h-3.5" /> View Details
      </button>
    </div>
  );
}
