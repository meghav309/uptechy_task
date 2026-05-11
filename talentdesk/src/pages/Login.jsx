import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim())                           errs.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email))        errs.email    = 'Enter a valid email.';
    if (!password)                               errs.password = 'Password is required.';
    else if (password.length < 6)               errs.password = 'Password must be at least 6 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setLoading(true);

    // Simulate network latency
    await new Promise(r => setTimeout(r, 800));

    const result = login(email.trim(), password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  const clearFieldError = (field) =>
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* ── Background glow orbs ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Card ── */}
      <div className="relative w-full max-w-md animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600
            flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)] mb-4 animate-pulse-glow">
            <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-syne font-bold text-3xl text-white tracking-tight">
            Talent<span className="text-gradient">Desk</span>
          </h1>
          <p className="text-slate-400 font-dm text-sm mt-1">Candidate Management Dashboard</p>
        </div>

        {/* Form card */}
        <div className="bg-navy-900/80 backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="font-syne font-bold text-xl text-white mb-0.5">Welcome back</h2>
            <p className="text-slate-400 font-dm text-sm">Sign in to your account to continue.</p>
          </div>

          {/* Credential hint */}
          <div className="mb-5 flex items-start gap-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
            <p className="text-xs text-cyan-300/80 font-dm leading-relaxed">
              Use <span className="text-cyan-300 font-semibold">admin@talentdesk.com</span> /{' '}
              <span className="text-cyan-300 font-semibold">admin123</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email"
                className="text-[11px] font-syne font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => { setEmail(e.target.value); clearFieldError('email'); setError(''); }}
                placeholder="admin@talentdesk.com"
                className={`
                  w-full bg-navy-800/80 border rounded-xl px-4 py-3 text-sm font-dm
                  text-slate-100 placeholder-slate-500 outline-none
                  transition-all duration-200
                  focus:ring-2 focus:ring-cyan-500/20
                  ${fieldErrors.email
                    ? 'border-red-500 focus:border-red-400 ring-2 ring-red-500/20'
                    : 'border-white/10 focus:border-cyan-500/70'
                  }
                `}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-400 font-dm flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />{fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password"
                className="text-[11px] font-syne font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearFieldError('password'); setError(''); }}
                  placeholder="••••••••"
                  className={`
                    w-full bg-navy-800/80 border rounded-xl px-4 py-3 pr-11 text-sm font-dm
                    text-slate-100 placeholder-slate-500 outline-none
                    transition-all duration-200
                    focus:ring-2 focus:ring-cyan-500/20
                    ${fieldErrors.password
                      ? 'border-red-500 focus:border-red-400 ring-2 ring-red-500/20'
                      : 'border-white/10 focus:border-cyan-500/70'
                    }
                  `}
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-400 font-dm flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />{fieldErrors.password}
                </p>
              )}
            </div>

            {/* Global error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300 font-dm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="
                w-full mt-2 py-3 rounded-xl font-syne font-bold text-sm
                bg-cyan-500 hover:bg-cyan-400
                text-navy-950
                shadow-[0_0_20px_rgba(0,229,255,0.35)] hover:shadow-[0_0_30px_rgba(0,229,255,0.55)]
                transition-all duration-200
                disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100
                active:scale-95 flex items-center justify-center gap-2.5
              "
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 font-dm mt-6">
          TalentDesk © {new Date().getFullYear()} — Demo Application
        </p>
      </div>
    </div>
  );
}
