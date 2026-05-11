/**
 * SkeletonCard — placeholder shown while API data loads.
 * Mimics the exact shape of a CandidateCard.
 */
export default function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-4 overflow-hidden relative">
      {/* Shimmer sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Avatar + name row */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-navy-700 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 dark:bg-navy-700 rounded-full animate-pulse w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-navy-700 rounded-full animate-pulse w-1/2" />
        </div>
      </div>

      {/* Email line */}
      <div className="h-3 bg-slate-200 dark:bg-navy-700 rounded-full animate-pulse w-5/6" />

      {/* Phone line */}
      <div className="h-3 bg-slate-200 dark:bg-navy-700 rounded-full animate-pulse w-2/3" />

      {/* Skill + status row */}
      <div className="flex items-center gap-2 pt-1">
        <div className="h-5 w-16 bg-slate-200 dark:bg-navy-700 rounded-full animate-pulse" />
        <div className="h-5 w-20 bg-slate-200 dark:bg-navy-700 rounded-full animate-pulse" />
      </div>

      {/* Button */}
      <div className="h-9 bg-slate-200 dark:bg-navy-700 rounded-xl animate-pulse mt-1" />
    </div>
  );
}
