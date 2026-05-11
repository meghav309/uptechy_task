import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('talentdesk-dark');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeView, setActiveView]             = useState('dashboard');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [sidebarOpen, setSidebarOpen]           = useState(false);
  const [searchQuery, setSearchQuery]           = useState('');
  const [toast, setToast]                       = useState(null);

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('talentdesk-dark', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDark = useCallback(() => setDarkMode(d => !d), []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const navigate = useCallback((view, candidate = null) => {
    setActiveView(view);
    if (candidate) setSelectedCandidate(candidate);
    setSidebarOpen(false);
  }, []);

  return (
    <AppContext.Provider value={{
      darkMode, toggleDark,
      activeView, navigate,
      selectedCandidate, setSelectedCandidate,
      sidebarOpen, setSidebarOpen,
      searchQuery, setSearchQuery,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
