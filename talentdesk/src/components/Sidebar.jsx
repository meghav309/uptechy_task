import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Zap,
  X,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'candidates', label: 'Candidates', icon: Users },
  { id: 'add-candidate', label: 'Add Candidate', icon: UserPlus },
];

export default function Sidebar() {
  const { activeView, navigate, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64
          bg-white dark:bg-navy-900
          border-r border-slate-200 dark:border-white/[0.06]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-2xl dark:shadow-black/40
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)]">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-syne font-bold text-xl text-slate-900 dark:text-white tracking-tight">
              Talent<span className="text-gradient">Desk</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation label */}
        <div className="px-5 pt-6 pb-2">
          <span className="text-[10px] font-syne font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
            Navigation
          </span>
        </div>

        {/* Nav links */}
        <nav className="px-3 flex-1 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id;
            return (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => navigate(id)}
                className={`nav-link w-full ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 dark:text-slate-500'}`}>
                  <Icon className="w-4.5 h-4.5" strokeWidth={isActive ? 2 : 1.75} />
                </span>
                <span className={`flex-1 text-left ${isActive ? 'text-cyan-300 dark:text-cyan-300' : ''}`}>
                  {label}
                </span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400/60" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom branding */}
        <div className="px-5 py-5 border-t border-slate-200 dark:border-white/[0.06]">
          <div className="glass-card px-4 py-3 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20">
            <p className="font-syne font-semibold text-slate-800 dark:text-white text-xs mb-0.5">TalentDesk Pro</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-dm">Streamline your hiring pipeline</p>
          </div>
        </div>
      </aside>
    </>
  );
}
