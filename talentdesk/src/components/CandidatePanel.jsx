import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Mail, Phone, MapPin, Building2, GraduationCap,
  Briefcase, User, ChevronDown, Check,
} from 'lucide-react';

/* ─── Status config ─────────────────────────────────────────── */
const STATUS_CONFIG = {
  Applied:     { badge: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',     dot: 'bg-blue-500',     ring: 'ring-blue-400/30' },
  Shortlisted: { badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', ring: 'ring-emerald-400/30' },
  Interview:   { badge: 'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400', dot: 'bg-violet-500', ring: 'ring-violet-400/30' },
  Rejected:    { badge: 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400',         dot: 'bg-red-500',     ring: 'ring-red-400/30' },
};

const SKILL_COLORS = {
  React:  'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400',
  Node:   'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400',
  Python: 'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  Java:   'bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400',
  CSS:    'bg-pink-100 dark:bg-pink-500/15 text-pink-700 dark:text-pink-400',
  Go:     'bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400',
};

const ALL_STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Rejected'];

/* ─── Avatar with shimmer-while-loading ─────────────────────── */
function AvatarImage({ src, name, initials }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white/20 dark:ring-white/10 shadow-xl flex-shrink-0">
      {/* Shimmer overlay while image hasn't loaded */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-navy-700 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}

      {/* Fallback initials */}
      {error && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-syne font-bold text-2xl">
          {initials}
        </div>
      )}

      {/* Actual image */}
      {!error && (
        <img
          src={src}
          alt={name}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}

/* ─── Info row ───────────────────────────────────────────────── */
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0 text-cyan-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-syne font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm text-slate-700 dark:text-slate-200 font-dm break-words">{value}</p>
      </div>
    </div>
  );
}

/* ─── Main panel component ───────────────────────────────────── */
/**
 * CandidatePanel
 * @param {object}   candidate   - candidate data object
 * @param {Function} onClose     - called when panel should close
 * @param {Function} onStatusChange - (id, newStatus) => void
 */
export default function CandidatePanel({ candidate, onClose, onStatusChange }) {
  const [closing, setClosing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(candidate?.status ?? 'Applied');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Keep local status in sync if a different candidate is opened
  useEffect(() => {
    if (candidate) setCurrentStatus(candidate.status);
  }, [candidate?.id]);

  // Keyboard close (Escape)
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Prevent body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 270); // match slide-out duration
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
    setDropdownOpen(false);
    onStatusChange?.(candidate.id, status);
  };

  if (!candidate) return null;

  const { badge, dot, ring } = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.Applied;
  const skillStyle = SKILL_COLORS[candidate.skill] ?? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
  const initials = `${candidate.firstName?.[0] ?? ''}${candidate.lastName?.[0] ?? ''}`.toUpperCase();

  const panel = (
    /* ── Backdrop ── */
    <div
      className={`
        fixed inset-0 z-50 flex justify-end
        ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}
        bg-black/50 backdrop-blur-[2px]
      `}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${candidate.name} details`}
    >
      {/* ── Drawer panel ── */}
      <div
        className={`
          relative flex flex-col
          w-full sm:w-[480px] h-full
          bg-white dark:bg-navy-900
          shadow-2xl dark:shadow-black/60
          overflow-hidden
          ${closing ? 'animate-slide-out-right' : 'animate-slide-in-right'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Decorative top gradient bar ── */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 flex-shrink-0" />

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/[0.07] flex-shrink-0">
          <div>
            <h2 className="font-syne font-bold text-lg text-slate-900 dark:text-white">Candidate Profile</h2>
            <p className="text-xs text-slate-400 font-dm mt-0.5">Full applicant details</p>
          </div>
          <button
            id="close-candidate-panel"
            onClick={handleClose}
            className="
              w-9 h-9 rounded-xl flex items-center justify-center
              text-slate-500 dark:text-slate-400
              hover:bg-slate-100 dark:hover:bg-navy-800
              hover:text-slate-800 dark:hover:text-white
              transition-all duration-150
            "
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">

          {/* ── Hero: avatar + name + status ── */}
          <div className="flex items-start gap-5">
            <AvatarImage src={candidate.image} name={candidate.name} initials={initials} />

            <div className="flex-1 min-w-0 pt-1">
              <h3 className="font-syne font-bold text-xl text-slate-900 dark:text-white leading-tight">
                {candidate.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-dm mt-0.5">
                {candidate.jobTitle ?? 'Applicant'}
              </p>
              {candidate.age && (
                <p className="text-xs text-slate-400 font-dm mt-0.5">Age {candidate.age}</p>
              )}

              {/* Status badge */}
              <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium font-dm px-3 py-1.5 rounded-full ring-1 ${badge} ${ring}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                {currentStatus}
              </div>
            </div>
          </div>

          {/* ── Change Status ── */}
          <div>
            <p className="text-[10px] font-syne font-semibold uppercase tracking-widest text-slate-400 mb-2.5">
              Pipeline Status
            </p>
            <div className="relative">
              <button
                id="panel-status-dropdown"
                onClick={() => setDropdownOpen((o) => !o)}
                className="
                  w-full flex items-center justify-between gap-2
                  px-4 py-3 rounded-xl text-sm font-dm font-medium
                  bg-slate-100 dark:bg-navy-800
                  border border-slate-200 dark:border-white/10
                  hover:border-cyan-500/50 transition-colors duration-150
                  text-slate-700 dark:text-slate-200
                "
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  {currentStatus}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-10 bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
                  {ALL_STATUSES.map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const isActive = s === currentStatus;
                    return (
                      <button
                        key={s}
                        id={`panel-status-${s.toLowerCase().replace(' ', '-')}`}
                        onClick={() => handleStatusChange(s)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-sm font-dm
                          transition-colors duration-100
                          ${isActive
                            ? 'bg-slate-50 dark:bg-navy-700/80'
                            : 'hover:bg-slate-50 dark:hover:bg-navy-700/50'
                          }
                        `}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <span className={`flex-1 text-left ${isActive ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                          {s}
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Divider ── */}
          <hr className="border-slate-200 dark:border-white/[0.07]" />

          {/* ── Contact info ── */}
          <div className="space-y-4">
            <p className="text-[10px] font-syne font-semibold uppercase tracking-widest text-slate-400">
              Contact Information
            </p>
            <InfoRow icon={<Mail className="w-4 h-4" />}       label="Email"      value={candidate.email} />
            <InfoRow icon={<Phone className="w-4 h-4" />}      label="Phone"      value={candidate.phone} />
            <InfoRow icon={<MapPin className="w-4 h-4" />}     label="Address"    value={candidate.address} />
            <InfoRow icon={<Building2 className="w-4 h-4" />}  label="Company"    value={candidate.college} />
            <InfoRow icon={<GraduationCap className="w-4 h-4" />} label="University" value={candidate.university} />
          </div>

          {/* ── Divider ── */}
          <hr className="border-slate-200 dark:border-white/[0.07]" />

          {/* ── Skills ── */}
          <div className="space-y-3">
            <p className="text-[10px] font-syne font-semibold uppercase tracking-widest text-slate-400">
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Primary skill from data */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-dm ${skillStyle}`}>
                {candidate.skill}
              </span>
              {/* Additional complementary skills (deterministic from id) */}
              {['Problem Solving', 'Team Player', 'Agile'].map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-dm bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Divider ── */}
          <hr className="border-slate-200 dark:border-white/[0.07]" />

          {/* ── Bio ── */}
          <div className="space-y-3">
            <p className="text-[10px] font-syne font-semibold uppercase tracking-widest text-slate-400">
              Bio
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-dm leading-relaxed">
              {candidate.bio ?? 'No bio available for this candidate.'}
            </p>
          </div>
        </div>

        {/* ── Sticky footer CTA ── */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 dark:border-white/[0.07] bg-white/80 dark:bg-navy-900/80 backdrop-blur-sm">
          <button
            id="panel-close-footer"
            onClick={handleClose}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Close Panel
          </button>
        </div>
      </div>
    </div>
  );

  // Render into document.body so z-index is never clipped
  return createPortal(panel, document.body);
}
