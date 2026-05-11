import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useCandidatesCtx } from '../context/CandidatesContext';
import { DEPARTMENTS } from '../data/candidates';
import { statusColors } from '../data/candidates';
import {
  ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar,
  Edit3, Check, X, Tag, Star, FileText, Trash2
} from 'lucide-react';

const STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Rejected'];

export default function CandidateDetail() {
  const { selectedCandidate, navigate } = useApp();
  const { updateCandidateData, deleteCandidateById } = useCandidatesCtx();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...selectedCandidate });

  if (!selectedCandidate) {
    navigate('candidates');
    return null;
  }

  const c = selectedCandidate;

  const handleSave = () => {
    updateCandidateData(c.id, form);
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Permanently remove ${c.name}?`)) {
      deleteCandidateById(c.id);
      navigate('candidates');
    }
  };

  const handleStatusChange = (status) => {
    updateCandidateData(c.id, { status });
    setForm(f => ({ ...f, status }));
  };

  return (
    <div className="page-enter space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <button
          id="back-to-candidates"
          onClick={() => navigate('candidates')}
          className="p-2.5 rounded-xl glass-card text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="font-syne font-bold text-2xl text-slate-900 dark:text-white">Candidate Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-dm">Detailed view & status management</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {editing ? (
            <>
              <button id="cancel-edit" onClick={() => { setEditing(false); setForm({ ...c }); }} className="btn-secondary flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button id="save-candidate" onClick={handleSave} className="btn-primary flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Save
              </button>
            </>
          ) : (
            <>
              <button id="delete-candidate-detail" onClick={handleDelete} className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all glass-card">
                <Trash2 className="w-4 h-4" />
              </button>
              <button id="edit-candidate" onClick={() => setEditing(true)} className="btn-primary flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="glass-card p-6 flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${c.avatarColor || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-white font-syne font-bold text-2xl shadow-lg`}
          >
            {c.avatar}
          </div>

          {editing ? (
            <div className="w-full space-y-3">
              <input className="input-field text-center font-syne font-bold" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name" />
              <input className="input-field text-center" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Role" />
              <select className="input-field" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          ) : (
            <>
              <div>
                <h2 className="font-syne font-bold text-xl text-slate-900 dark:text-white">{c.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-dm">{c.role}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-dm">{c.department}</p>
              </div>
            </>
          )}

          {/* Status selector */}
          <div className="w-full pt-2 border-t border-slate-200 dark:border-white/10">
            <p className="text-[10px] font-syne font-semibold uppercase tracking-widest text-slate-400 mb-2">Pipeline Status</p>
            <div className="grid grid-cols-2 gap-1.5">
              {STATUSES.map(s => (
                <button
                  key={s}
                  id={`status-${s.toLowerCase().replace(' ', '-')}`}
                  onClick={() => handleStatusChange(s)}
                  className={`
                    text-xs py-1.5 px-2 rounded-lg font-medium font-dm transition-all
                    ${(form.status || c.status) === s
                      ? 'bg-cyan-500 text-navy-950 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                      : 'bg-slate-100 dark:bg-navy-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-navy-700'
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-dm flex items-center gap-1"><Star className="w-3 h-3" /> Match Score</span>
              <span className="font-syne font-bold text-cyan-400">{c.score}%</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-navy-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${c.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact Info */}
          <div className="glass-card p-6">
            <h3 className="font-syne font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editing ? (
                <>
                  <div>
                    <label className="text-[11px] text-slate-400 font-dm mb-1 block">Email</label>
                    <input className="input-field" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-dm mb-1 block">Phone</label>
                    <input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-dm mb-1 block">Location</label>
                    <input className="input-field" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-dm mb-1 block">Experience</label>
                    <input className="input-field" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} placeholder="e.g. 5 years" />
                  </div>
                </>
              ) : (
                <>
                  <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={c.email} />
                  <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={c.phone} />
                  <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} label="Location" value={c.location} />
                  <InfoRow icon={<Briefcase className="w-3.5 h-3.5" />} label="Experience" value={c.experience} />
                  <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Applied" value={c.appliedDate} />
                  <InfoRow icon={<Tag className="w-3.5 h-3.5" />} label="Department" value={c.department} />
                </>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card p-6">
            <h3 className="font-syne font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-400" /> Skills
            </h3>
            {editing ? (
              <input
                className="input-field"
                value={form.skills ? form.skills.join(', ') : ''}
                onChange={e => setForm(f => ({ ...f, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                placeholder="React, Node.js, TypeScript (comma separated)"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {(c.skills || []).map(skill => (
                  <span key={skill} className="badge badge-cyan text-xs px-3 py-1">{skill}</span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="glass-card p-6">
            <h3 className="font-syne font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Recruiter Notes
            </h3>
            {editing ? (
              <textarea
                className="input-field resize-none h-28"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Add your notes about this candidate..."
              />
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300 font-dm leading-relaxed">
                {c.notes || <span className="text-slate-400 italic">No notes added yet.</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-cyan-400 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] font-syne font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm text-slate-700 dark:text-slate-200 font-dm">{value}</p>
      </div>
    </div>
  );
}
