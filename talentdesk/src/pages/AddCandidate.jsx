import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useCandidatesCtx } from '../context/CandidatesContext';
import {
  UserPlus, Loader2, CheckCircle2, X,
  User, Mail, Phone, Building2, Tag, FileText, ChevronDown,
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────────────────────────
const STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Rejected'];
const BIO_MAX = 300;

// ── Validation ─────────────────────────────────────────────────────────────────
function validate(fields) {
  const errors = {};

  if (!fields.name.trim() || fields.name.trim().length < 3)
    errors.name = 'Full name must be at least 3 characters.';

  if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Enter a valid email address.';

  if (!fields.phone.trim() || !/^\d{10}$/.test(fields.phone.replace(/\D/g, '')))
    errors.phone = 'Phone must be a 10-digit number.';

  if (!fields.college.trim())
    errors.college = 'College / Institution name is required.';

  if (fields.skills.length === 0)
    errors.skills = 'Add at least one skill.';

  if (fields.bio.length > BIO_MAX)
    errors.bio = `Bio cannot exceed ${BIO_MAX} characters.`;

  return errors;
}

// ── Reusable field wrapper ─────────────────────────────────────────────────────
function FormField({ label, htmlFor, icon: Icon, error, children, hint }) {
  return (
    <div className="space-y-1.5 animate-fade-in">
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1.5 text-xs font-syne font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400"
        >
          {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400" />}
          {label}
        </label>
        {hint && <span className="text-[10px] text-slate-400 font-dm">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 font-dm animate-fade-in">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Skill tag input ────────────────────────────────────────────────────────────
function SkillTagInput({ skills, onChange, error }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput('');
    inputRef.current?.focus();
  };

  const removeSkill = (skill) => onChange(skills.filter((s) => s !== skill));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
    if (e.key === 'Backspace' && !input && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div
      className={`
        flex flex-wrap gap-2 min-h-[44px] px-3 py-2 rounded-xl cursor-text
        bg-white/80 dark:bg-navy-800/80
        border transition-all duration-200
        ${error
          ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20'
          : 'border-slate-200 dark:border-slate-700 focus-within:border-cyan-500 dark:focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20'
        }
      `}
      onClick={() => inputRef.current?.focus()}
    >
      {skills.map((skill) => (
        <span
          key={skill}
          className="
            inline-flex items-center gap-1.5
            bg-cyan-100 dark:bg-cyan-500/20
            text-cyan-700 dark:text-cyan-400
            text-xs font-medium font-dm
            px-2.5 py-1 rounded-full
            border border-cyan-200 dark:border-cyan-500/30
          "
        >
          {skill}
          <button
            type="button"
            onClick={() => removeSkill(skill)}
            className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
            aria-label={`Remove ${skill}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id="field-skills"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : ''}
        className="
          flex-1 min-w-[140px] bg-transparent outline-none
          text-sm text-slate-800 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          font-dm py-0.5
        "
        aria-label="Add skill"
      />
    </div>
  );
}

// ── Empty initial form ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  college: '',
  skills: [],
  status: 'Applied',
  bio: '',
};

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AddCandidate() {
  const { navigate }     = useApp();
  const { addCandidate } = useCandidatesCtx();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const clearError = (field) =>
    setErrors((e) => ({ ...e, [field]: undefined }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstId = Object.keys(errs)[0];
      document.getElementById(`field-${firstId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    setErrors({});

    // Simulated 1-second "submit" delay
    await new Promise((res) => setTimeout(res, 1000));

    addCandidate({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      college: form.college.trim(),
      skills: form.skills,
      status: form.status,
      bio: form.bio.trim(),
      // Fields expected by AppContext.addCandidate
      role: form.skills[0] ? `${form.skills[0]} Developer` : 'Candidate',
      department: 'General',
      location: '',
      experience: 'N/A',
      notes: form.bio.trim(),
    });

    setSubmitting(false);
    setDone(true);
    setForm(EMPTY_FORM);

    // Return to form after brief success display
    setTimeout(() => {
      setDone(false);
      navigate('candidates');
    }, 2000);
  };

  // ── Success screen ───────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="page-enter flex flex-col items-center justify-center min-h-[65vh] text-center gap-5">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.35)] animate-pulse-glow">
          <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="font-syne font-bold text-2xl text-slate-900 dark:text-white mb-1">
            Candidate Added!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-dm">
            Redirecting to the candidates list…
          </p>
        </div>
      </div>
    );
  }

  const bioRemaining = BIO_MAX - form.bio.length;

  return (
    <div className="page-enter max-w-2xl mx-auto">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(0,229,255,0.35)] flex-shrink-0">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-syne font-bold text-3xl text-slate-900 dark:text-white">
            Add Candidate
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-dm ml-13 pl-[52px]">
          Fill in the details to add a new applicant to the pipeline.
        </p>
      </div>

      {/* ── Form card ───────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="glass-card p-7 sm:p-9 space-y-7"
      >

        {/* ── Full Name ── */}
        <FormField
          label="Full Name"
          htmlFor="field-name"
          icon={User}
          error={errors.name}
        >
          <input
            id="field-name"
            type="text"
            value={form.name}
            onChange={set('name')}
            onFocus={() => clearError('name')}
            placeholder="e.g. Jane Smith"
            className={`input-field ${errors.name ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20 focus:ring-red-400/20' : ''}`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'err-name' : undefined}
          />
        </FormField>

        {/* ── Email ── */}
        <FormField
          label="Email Address"
          htmlFor="field-email"
          icon={Mail}
          error={errors.email}
        >
          <input
            id="field-email"
            type="email"
            value={form.email}
            onChange={set('email')}
            onFocus={() => clearError('email')}
            placeholder="jane@example.com"
            className={`input-field ${errors.email ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20 focus:ring-red-400/20' : ''}`}
            aria-invalid={!!errors.email}
          />
        </FormField>

        {/* ── Phone + College (2-col) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            label="Phone"
            htmlFor="field-phone"
            icon={Phone}
            error={errors.phone}
            hint="10 digits"
          >
            <input
              id="field-phone"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              onFocus={() => clearError('phone')}
              placeholder="9876543210"
              maxLength={15}
              className={`input-field ${errors.phone ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20 focus:ring-red-400/20' : ''}`}
              aria-invalid={!!errors.phone}
            />
          </FormField>

          <FormField
            label="College / Institution"
            htmlFor="field-college"
            icon={Building2}
            error={errors.college}
          >
            <input
              id="field-college"
              type="text"
              value={form.college}
              onChange={set('college')}
              onFocus={() => clearError('college')}
              placeholder="e.g. MIT, Stanford…"
              className={`input-field ${errors.college ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20 focus:ring-red-400/20' : ''}`}
              aria-invalid={!!errors.college}
            />
          </FormField>
        </div>

        {/* ── Skills tag input ── */}
        <FormField
          label="Skills"
          htmlFor="field-skills"
          icon={Tag}
          error={errors.skills}
          hint="Press Enter to add"
        >
          <SkillTagInput
            skills={form.skills}
            onChange={(skills) => {
              setForm((f) => ({ ...f, skills }));
              if (skills.length > 0) clearError('skills');
            }}
            error={errors.skills}
          />
        </FormField>

        {/* ── Status dropdown ── */}
        <FormField
          label="Application Status"
          htmlFor="field-status"
          icon={ChevronDown}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {STATUSES.map((s) => {
              const active = form.status === s;
              const colors = {
                Applied:     active ? 'bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] border-blue-500'     : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-400',
                Shortlisted: active ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)] border-emerald-500' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-400',
                Interview:   active ? 'bg-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)] border-violet-500'  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-violet-400',
                Rejected:    active ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] border-red-500'         : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-400',
              };
              return (
                <button
                  key={s}
                  type="button"
                  id={`status-btn-${s.toLowerCase()}`}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`
                    py-2.5 rounded-xl text-xs font-dm font-semibold border
                    transition-all duration-200 ${colors[s]}
                  `}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FormField>

        {/* ── Bio textarea ── */}
        <FormField
          label="Short Bio"
          htmlFor="field-bio"
          icon={FileText}
          error={errors.bio}
          hint={
            <span className={`font-syne font-semibold ${bioRemaining < 30 ? 'text-red-400' : bioRemaining < 80 ? 'text-amber-400' : 'text-slate-400'}`}>
              {bioRemaining} / {BIO_MAX}
            </span>
          }
        >
          <textarea
            id="field-bio"
            value={form.bio}
            onChange={set('bio')}
            onFocus={() => clearError('bio')}
            rows={4}
            maxLength={BIO_MAX + 1}   /* allow overflow so validation fires */
            placeholder="A brief summary about the candidate's background and experience…"
            className={`input-field resize-none leading-relaxed ${errors.bio ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20 focus:ring-red-400/20' : ''}`}
            aria-invalid={!!errors.bio}
          />
          {/* Live char bar */}
          <div className="h-1 bg-slate-200 dark:bg-navy-700 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                bioRemaining < 30 ? 'bg-red-500' : bioRemaining < 80 ? 'bg-amber-400' : 'bg-cyan-500'
              }`}
              style={{ width: `${(form.bio.length / BIO_MAX) * 100}%` }}
            />
          </div>
        </FormField>

        {/* ── Divider ── */}
        <hr className="border-slate-200 dark:border-white/10" />

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            id="cancel-add"
            onClick={() => navigate('candidates')}
            className="btn-secondary flex-1 sm:flex-none"
          >
            Cancel
          </button>

          <button
            type="submit"
            id="submit-add-candidate"
            disabled={submitting}
            className="
              btn-primary flex-1 flex items-center justify-center gap-2.5
              disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100
            "
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Adding…</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Add to Pipeline</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
