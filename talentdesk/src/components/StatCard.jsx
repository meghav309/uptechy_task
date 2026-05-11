export default function StatCard({ icon: Icon, label, value, change, color, bgGradient, glowColor }) {
  return (
    <div
      className={`
        glass-card p-6 relative overflow-hidden
        hover:scale-[1.02] transition-all duration-300 cursor-default
        hover:shadow-xl hover:${glowColor || 'shadow-cyan-500/10'}
      `}
    >
      {/* Background gradient blob */}
      <div
        className={`
          absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl
          ${bgGradient || 'bg-gradient-to-br from-cyan-400 to-blue-600'}
        `}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center mb-4
            ${bgGradient || 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20'}
            border border-white/10
          `}
        >
          <Icon className={`w-5 h-5 ${color || 'text-cyan-400'}`} strokeWidth={1.75} />
        </div>

        {/* Value */}
        <div className="flex items-end gap-2 mb-1">
          <span className="font-syne font-bold text-3xl text-slate-900 dark:text-white leading-none">
            {value}
          </span>
          {change !== undefined && (
            <span
              className={`text-xs font-medium font-dm mb-0.5 ${
                change >= 0 ? 'text-emerald-500' : 'text-red-400'
              }`}
            >
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>

        {/* Label */}
        <p className="text-sm text-slate-500 dark:text-slate-400 font-dm">{label}</p>
      </div>
    </div>
  );
}
