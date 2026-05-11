import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { CandidatesProvider } from './context/CandidatesContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import AddCandidate from './pages/AddCandidate';
import CandidateDetail from './components/CandidateDetail';
import Login from './pages/Login';

// ── Main shell (only rendered when authenticated) ─────────────────────────────
function AppShell() {
  const { activeView } = useApp();
  const [displayView, setDisplayView] = useState(activeView);
  const [animating,   setAnimating]   = useState(false);

  useEffect(() => {
    if (activeView !== displayView) {
      setAnimating(true);
      const t = setTimeout(() => {
        setDisplayView(activeView);
        setAnimating(false);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [activeView, displayView]);

  const renderPage = () => {
    switch (displayView) {
      case 'dashboard':        return <Dashboard />;
      case 'candidates':       return <Candidates />;
      case 'add-candidate':    return <AddCandidate />;
      case 'candidate-detail': return <CandidateDetail />;
      default:                 return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 transition-colors duration-300">
      <Sidebar />
      <Navbar />
      <main className="lg:pl-64 pt-16">
        <div
          className={`p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]`}
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 120ms ease-out, transform 120ms ease-out',
          }}
        >
          {renderPage()}
        </div>
      </main>
      <Toast />
    </div>
  );
}

// ── Auth gate — decides what to render ───────────────────────────────────────
function AuthGate() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Login />;

  return (
    <AppProvider>
      <CandidatesProvider>
        <AppShell />
      </CandidatesProvider>
    </AppProvider>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
