export default function InsightSkeleton() {
  return (
    <div className="bg-slate-900 flex flex-col animate-pulse">
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

      {/* BALANCE */}
      <section className="p-4 flex flex-col gap-4">
        <div className="bg-white/5 rounded-xl p-4 ">
          <div className="h-3 w-20 bg-white/20 rounded mb-3" />
          <div className="h-6 w-40 bg-white/20 rounded" />
        </div>

        <div className="flex gap-4 py-8">
          <div className="flex-1">
            <div className="h-3 w-16 bg-white/20 rounded mb-2" />
            <div className="h-4 w-24 bg-white/20 rounded" />
          </div>

          <div className="flex-1">
            <div className="h-3 w-16 bg-white/20 rounded mb-2" />
            <div className="h-4 w-24 bg-white/20 rounded" />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-slate-50 min-h-dvh p-4 space-y-4 pb-24">
        {/* Filter */}
        <div className="h-10 bg-white rounded-xl" />

        {/* Daily Expenses */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-px bg-slate-100" />
          <div className="h-40 bg-slate-100 rounded-xl" />
        </div>

        {/* Top Expenses */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-px bg-slate-100" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-100 rounded" />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl p-4 space-y-4">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="h-px bg-slate-100" />

          <div className="h-40 bg-slate-100 rounded-full w-40 mx-auto" />

          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
