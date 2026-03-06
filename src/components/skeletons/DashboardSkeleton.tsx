export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Month Navigation */}
      <section className="flex justify-between items-center gap-4 px-4 py-6">
        {/* Left arrow */}
        <div className="w-8 h-8 bg-white/30 rounded-full"></div>

        {/* Month text */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-3 w-16 bg-white/30 rounded"></div>
          <div className="h-4 w-40 bg-white/40 rounded"></div>
        </div>

        {/* Right arrow */}
        <div className="w-8 h-8 bg-white/30 rounded-full"></div>
      </section>

      {/* Current Balance Skeleton */}
      <section className="px-4 py-8 animate-pulse">
        <div className="h-4 w-32 bg-white/30 rounded mb-3"></div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-40 bg-white/40 rounded"></div>
          <div className="w-6 h-6 bg-white/30 rounded"></div>
        </div>
      </section>

      {/* Account Balances Skeleton */}
      <div className="flex gap-4 px-4 py-6 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-36 h-19 bg-white/20 rounded-2xl" />
        ))}
      </div>

      {/* Transactions Skeleton */}
      <section className="bg-white rounded-t-3xl overflow-hidden flex flex-col">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 space-y-3">
            <div className="h-4 w-32 bg-slate-300 rounded"></div>
            <div className="h-3 w-full bg-slate-200 rounded"></div>
            <div className="h-3 w-3/4 bg-slate-200 rounded"></div>
          </div>
        ))}
      </section>
    </div>
  );
}
