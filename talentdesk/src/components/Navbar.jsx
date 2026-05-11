import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Search, Sun, Moon, Menu, Bell, LogOut } from 'lucide-react';

export default function Navbar() {
  const { darkMode, toggleDark, searchQuery, setSearchQuery, setSidebarOpen } = useApp();
  const { logout } = useAuth();

  return (
    <header
      className="
        fixed top-0 right-0 z-10
        h-16 left-0 lg:left-64
        bg-white/80 dark:bg-navy-900/80
        backdrop-blur-md
        border-b border-slate-200 dark:border-white/[0.06]
        flex items-center gap-4 px-4 lg:px-8
        transition-all duration-300
      "
    >
      {/* Hamburger — mobile only */}
      <button
        id="sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search bar */}
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          id="global-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search candidates, roles, departments..."
          className="input-field pl-10"
          aria-label="Global search"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notification bell */}
        <button
          id="notifications-btn"
          className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full ring-2 ring-white dark:ring-navy-900" />
        </button>

        {/* Dark mode toggle */}
        <button
          id="dark-mode-toggle"
          onClick={toggleDark}
          className="
            flex items-center gap-2 px-3 py-2 rounded-xl
            bg-slate-100 dark:bg-navy-800
            border border-slate-200 dark:border-white/10
            text-slate-600 dark:text-slate-300
            hover:border-cyan-500/50 hover:text-cyan-500 dark:hover:text-cyan-400
            transition-all duration-200 text-xs font-medium font-dm
          "
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <><Sun className="w-4 h-4" /><span className="hidden sm:inline">Light</span></>
          ) : (
            <><Moon className="w-4 h-4" /><span className="hidden sm:inline">Dark</span></>
          )}
        </button>

        {/* User avatar + logout */}
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-syne font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)]">
            HR
          </div>
          <button
            id="logout-btn"
            onClick={() => {
              if (window.confirm('Sign out of TalentDesk?')) logout();
            }}
            className="
              p-2 rounded-xl text-slate-500 dark:text-slate-400
              hover:bg-red-50 dark:hover:bg-red-500/10
              hover:text-red-500 dark:hover:text-red-400
              transition-all duration-150
            "
            aria-label="Logout"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
