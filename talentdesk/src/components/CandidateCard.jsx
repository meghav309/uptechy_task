import { useApp } from '../context/AppContext';
import { statusColors } from '../data/candidates';
import { Eye, Trash2, MapPin, Briefcase } from 'lucide-react';

export default function CandidateCard({ candidate }) {
  const { navigate, deleteCandidate } = useApp();

  const handleView = () => {
    navigate('candidate-detail', candidate);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Remove ${candidate.name} from the pipeline?`)) {
      deleteCandidate(candidate.id);
    }
  };

  return (
    <div
      className="glass-card p-5 hover:scale-[1.015] hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-250 cursor-pointer group"
      onClick={handleView}
      role="button"
      tabIndex={0}
      aria-label={`View ${candidate.name}`}
      onKeyDown={(e) => e.key === 'Enter' && handleView()}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Avatar + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`
              w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center
              bg-gradient-to-br ${candidate.avatarColor || 'from-cyan-500 to-blue-600'}
              text-white font-syne font-bold text-sm shadow-md
            `}
          >
            {candidate.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-syne font-semibold text-slate-900 dark:text-white text-sm truncate">
              {candidate.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-dm truncate mt-0.5">
              {candidate.role}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <span className={`badge ${statusColors[candidate.status] || 'badge-blue'} flex-shrink-0`}>
          {candidate.status}
        </span>
      </div>

      {/* Meta info */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-dm">
          <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{candidate.department} · {candidate.experience}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-dm">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{candidate.location}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-dm">Match Score</span>
          <span className="text-[11px] font-syne font-semibold text-cyan-500 dark:text-cyan-400">
            {candidate.score}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${candidate.score}%` }}
          />
        </div>
      </div>

      {/* Actions — appear on hover */}
      <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          id={`view-candidate-${candidate.id}`}
          onClick={(e) => { e.stopPropagation(); handleView(); }}
          className="btn-primary flex-1 flex items-center justify-center gap-1.5 py-2"
        >
          <Eye className="w-3.5 h-3.5" />
          View Profile
        </button>
        <button
          id={`delete-candidate-${candidate.id}`}
          onClick={handleDelete}
          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
          aria-label={`Delete ${candidate.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
