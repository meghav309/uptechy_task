import { useApp } from '../context/AppContext';
import { useCandidatesCtx } from '../context/CandidatesContext';
import StatCard from '../components/StatCard';
import { Users, CheckCircle, XCircle, Clock, TrendingUp, ArrowRight, Activity, UserPlus } from 'lucide-react';

// ── Recent candidate row ──────────────────────────────────────────────────────
function RecentRow({ c, onClick }) {
  const colorMap = {
    Applied:     'text-blue-400 bg-blue-400/10',
    Shortlisted: 'text-emerald-400 bg-emerald-400/10',
    Interview:   'text-violet-400 bg-violet-400/10',
    Rejected:    'text-red-400 bg-red-400/10',
  };
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-700/50 transition-all duration-150 text-left group">
      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center
        bg-gradient-to-br ${c.avatarColor ?? 'from-cyan-500 to-blue-600'} text-white font-syne font-bold text-xs shadow`}>
        {c.avatar ?? c.name?.slice(0,2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-syne font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
          {c.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-dm truncate">{c.role ?? c.jobTitle}</p>
      </div>
      <div className={`flex-shrink-0 text-xs font-medium font-dm px-2.5 py-1 rounded-full ${colorMap[c.status] ?? 'text-slate-400 bg-slate-400/10'}`}>
        {c.status}
      </div>
    </button>
  );
}

// ── Empty dashboard state ─────────────────────────────────────────────────────
function EmptyDashboard({ onAdd }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center py-20 text-center gap-5 animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160"
        className="w-40 h-32 opacity-70" aria-hidden="true">
        <rect x="20" y="30" width="160" height="100" rx="12" fill="currentColor" className="text-slate-200 dark:text-navy-800" />
        <rect x="40" y="55" width="60" height="8" rx="4" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
        <rect x="40" y="73" width="100" height="6" rx="3" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
        <rect x="40" y="89" width="80" height="6" rx="3" fill="currentColor" className="text-slate-300 dark:text-slate-700" />
        <circle cx="155" cy="45" r="20" fill="currentColor" className="text-cyan-400/30 dark:text-cyan-500/20" />
        <line x1="148" y1="45" x2="162" y2="45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-cyan-500" />
        <line x1="155" y1="38" x2="155" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-cyan-500" />
      </svg>
      <div>
        <h3 className="font-syne font-bold text-xl text-slate-700 dark:text-slate-300 mb-1">No candidates yet</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-dm">Add your first candidate to get started.</p>
      </div>
      <button onClick={onAdd} className="btn-primary flex items-center gap-2">
        <UserPlus className="w-4 h-4" /> Add First Candidate
      </button>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { navigate } = useApp();
  const { allCandidates, stats, loading } = useCandidatesCtx();

  const recentCandidates = allCandidates.slice(0, 4);

  const statCards = [
    { icon: Users,        label: 'Total Applicants', value: stats.total,       change: 12, bgGradient: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20',    color: 'text-cyan-400' },
    { icon: CheckCircle,  label: 'Shortlisted',      value: stats.shortlisted, change: 8,  bgGradient: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20',  color: 'text-emerald-400' },
    { icon: XCircle,      label: 'Rejected',          value: stats.rejected,    change: -3, bgGradient: 'bg-gradient-to-br from-red-500/20 to-rose-600/20',      color: 'text-red-400' },
    { icon: Clock,        label: 'Interview',         value: stats.interview,   change: 5,  bgGradient: 'bg-gradient-to-br from-violet-500/20 to-purple-600/20',  color: 'text-violet-400' },
  ];

  const pipeline = [
    { label: 'Applied',     count: stats.applied,     color: 'bg-blue-500' },
    { label: 'Interview',   count: stats.interview,   color: 'bg-violet-500' },
    { label: 'Shortlisted', count: stats.shortlisted, color: 'bg-emerald-500' },
    { label: 'Rejected',    count: stats.rejected,    color: 'bg-red-500' },
  ].map(s => ({ ...s, pct: stats.total > 0 ? Math.round((s.count / stats.total) * 100) : 0 }));

  return (
    <div className="page-enter space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-syne font-bold text-3xl text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-dm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button id="dashboard-add-candidate" onClick={() => navigate('add-candidate')}
          className="btn-primary hidden sm:flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Add Candidate
        </button>
      </div>

      {/* ── Empty state ── */}
      {!loading && stats.total === 0 && (
        <EmptyDashboard onAdd={() => navigate('add-candidate')} />
      )}

      {/* ── Stat cards ── */}
      {(loading || stats.total > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={i} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-in">
              <StatCard {...card} />
            </div>
          ))}
        </div>
      )}

      {/* ── Lower row ── */}
      {(loading || stats.total > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Pipeline breakdown */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="font-syne font-semibold text-slate-900 dark:text-white">Pipeline Breakdown</h2>
            </div>
            <div className="space-y-4">
              {pipeline.map(({ label, count, color, pct }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-dm">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-syne font-semibold text-slate-900 dark:text-white text-sm">{count}</span>
                      <span className="text-xs text-slate-400 font-dm">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-navy-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="font-syne font-bold text-2xl text-cyan-400">{stats.total}</p>
                <p className="text-xs text-slate-400 font-dm">Total</p>
              </div>
              <div className="text-center">
                <p className="font-syne font-bold text-2xl text-emerald-400">
                  {stats.total > 0 ? Math.round((stats.shortlisted / stats.total) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-400 font-dm">Pass Rate</p>
              </div>
            </div>
          </div>

          {/* Recent applicants */}
          <div className="lg:col-span-3 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" /> Recent Applicants
              </h2>
              <button id="view-all-candidates" onClick={() => navigate('candidates')}
                className="text-xs text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 font-dm flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-navy-700 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 dark:bg-navy-700 rounded-full animate-pulse w-3/4" />
                      <div className="h-2.5 bg-slate-200 dark:bg-navy-700 rounded-full animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentCandidates.length === 0 ? (
              <p className="text-sm text-slate-400 font-dm text-center py-8">No recent candidates.</p>
            ) : (
              <div className="space-y-1">
                {recentCandidates.map(c => (
                  <RecentRow key={c.id} c={c} onClick={() => navigate('candidate-detail', c)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
