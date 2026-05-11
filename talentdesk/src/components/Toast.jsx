import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  info: <Info className="w-4 h-4 text-blue-400" />,
  error: <AlertCircle className="w-4 h-4 text-red-400" />,
};

const borderColors = {
  success: 'border-emerald-400/40',
  info: 'border-blue-400/40',
  error: 'border-red-400/40',
};

export default function Toast() {
  const { toast, showToast } = useApp();

  if (!toast) return null;

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-3 px-4 py-3
        glass-card border ${borderColors[toast.type] || 'border-white/10'}
        shadow-2xl min-w-[260px] max-w-sm
        animate-fade-in
      `}
      role="alert"
    >
      {icons[toast.type] || icons.info}
      <p className="font-dm text-sm text-slate-800 dark:text-slate-100 flex-1">{toast.message}</p>
      <button
        onClick={() => showToast(null)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
