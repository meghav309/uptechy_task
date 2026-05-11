import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from './AppContext';

const CandidatesContext = createContext(null);

const SKILLS   = ['React', 'Node', 'Python', 'Java', 'CSS', 'Go'];
const STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Rejected'];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Normalize a DummyJSON user into the unified candidate shape */
function normalizeApiUser(u) {
  return {
    id: u.id,
    _source: 'api',
    firstName: u.firstName,
    lastName: u.lastName,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    phone: u.phone,
    image: u.image,
    college: u.company?.name ?? 'N/A',
    jobTitle: u.company?.title ?? 'Candidate',
    address: [u.address?.city, u.address?.state, u.address?.country].filter(Boolean).join(', '),
    university: u.university ?? 'N/A',
    age: u.age ?? null,
    skill: rand(SKILLS),
    skills: [rand(SKILLS)],
    status: rand(STATUSES),
    bio: `${u.firstName} is a ${u.company?.title ?? 'professional'} at ${u.company?.name ?? 'a firm'}, ` +
      `based in ${u.address?.city ?? 'N/A'}. Results-driven with a collaborative mindset.`,
    // Detail-view compat fields
    role: u.company?.title ?? 'Candidate',
    department: 'General',
    location: u.address?.city ?? '',
    experience: 'N/A',
    avatar: `${u.firstName[0]}${u.lastName[0]}`.toUpperCase(),
    avatarColor: 'from-cyan-500 to-blue-600',
    score: Math.floor(Math.random() * 35) + 60,
    notes: '',
    appliedDate: new Date().toISOString().split('T')[0],
  };
}

/** Normalize form data into the unified candidate shape */
function normalizeManual(formData, id) {
  const parts = formData.name.trim().split(' ');
  const skill  = formData.skills?.[0] ?? 'React';
  return {
    id,
    _source: 'manual',
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    image: null,
    college: formData.college.trim(),
    jobTitle: `${skill} Developer`,
    address: '',
    university: formData.college.trim(),
    age: null,
    skill,
    skills: formData.skills ?? [],
    status: formData.status ?? 'Applied',
    bio: formData.bio?.trim() ?? '',
    // Detail-view compat
    role: `${skill} Developer`,
    department: 'General',
    location: '',
    experience: 'N/A',
    avatar: parts.map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    avatarColor: 'from-cyan-500 to-blue-600',
    score: Math.floor(Math.random() * 30) + 60,
    notes: formData.bio?.trim() ?? '',
    appliedDate: new Date().toISOString().split('T')[0],
  };
}

export function CandidatesProvider({ children }) {
  const { showToast } = useApp();

  const [apiCandidates, setApiCandidates] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  // Manual candidates persisted to localStorage
  const [manualCandidates, setManualCandidates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('td-manual') ?? '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('td-manual', JSON.stringify(manualCandidates));
  }, [manualCandidates]);

  // Fetch from DummyJSON once on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res  = await fetch('https://dummyjson.com/users?limit=20');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setApiCandidates(data.users.map(normalizeApiUser));
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Merged list — manual (newest first) on top
  const allCandidates = useMemo(() => [
    ...manualCandidates,
    ...apiCandidates,
  ], [manualCandidates, apiCandidates]);

  const stats = useMemo(() => ({
    total:       allCandidates.length,
    applied:     allCandidates.filter(c => c.status === 'Applied').length,
    shortlisted: allCandidates.filter(c => c.status === 'Shortlisted').length,
    interview:   allCandidates.filter(c => c.status === 'Interview').length,
    rejected:    allCandidates.filter(c => c.status === 'Rejected').length,
  }), [allCandidates]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const addCandidate = useCallback((formData) => {
    const id  = Date.now();
    const c   = normalizeManual(formData, id);
    setManualCandidates(prev => [c, ...prev]);
    showToast('Candidate added successfully ✓', 'success');
    return c;
  }, [showToast]);

  const updateCandidateStatus = useCallback((id, status) => {
    const upd = prev => prev.map(c => c.id === id ? { ...c, status } : c);
    setApiCandidates(upd);
    setManualCandidates(upd);
  }, []);

  const updateCandidateData = useCallback((id, updates) => {
    const upd = prev => prev.map(c => c.id === id ? { ...c, ...updates } : c);
    setApiCandidates(upd);
    setManualCandidates(upd);
    showToast('Candidate updated!', 'success');
  }, [showToast]);

  const deleteCandidateById = useCallback((id) => {
    setApiCandidates(prev => prev.filter(c => c.id !== id));
    setManualCandidates(prev => prev.filter(c => c.id !== id));
    showToast('Candidate removed.', 'info');
  }, [showToast]);

  return (
    <CandidatesContext.Provider value={{
      allCandidates, loading, error, stats, STATUSES,
      addCandidate, updateCandidateStatus, updateCandidateData, deleteCandidateById,
    }}>
      {children}
    </CandidatesContext.Provider>
  );
}

export const useCandidatesCtx = () => {
  const ctx = useContext(CandidatesContext);
  if (!ctx) throw new Error('useCandidatesCtx must be used within CandidatesProvider');
  return ctx;
};
