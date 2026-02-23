export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6 px-4 pb-10">
      {/* Current Balance Skeleton */}
      <div className="bg-white rounded-2xl p-6">
        <div className="h-4 w-24 bg-slate-300 rounded mb-3"></div>
        <div className="h-8 w-40 bg-slate-400 rounded"></div>
      </div>

      {/* Payment Balances Skeleton */}
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="min-w-37.5 h-20 bg-slate-300 rounded-2xl"
          />
        ))}
      </div>

      {/* Transactions Skeleton */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 space-y-3">
          <div className="h-4 w-32 bg-slate-300 rounded"></div>
          <div className="h-3 w-full bg-slate-200 rounded"></div>
          <div className="h-3 w-3/4 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
