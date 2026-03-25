export default function BudgetSkeleton() {
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

      {/* Card */}
      <section className="mx-4 mt-4 mb-6">
        <div className="bg-white/5 px-4 py-8 rounded-2xl flex flex-col gap-5 animate-pulse">
          {/* HEADER */}
          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <div className="flex justify-center items-center bg-white/30 rounded-lg p-2">
                <div className="h-4 w-4 bg-white/30 rounded" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="h-4 w-24 bg-white/30 rounded" />
                <div className="h-3 w-32 bg-white/30 rounded" />
              </div>
            </div>

            <div className="h-7 w-16 bg-white/30 rounded-lg" />
          </div>

          {/* TOTAL */}
          <div className="flex flex-col gap-2">
            <div className="h-6 w-40 bg-white/30 rounded" />
            <div className="h-3 w-32 bg-white/30 rounded" />
          </div>

          {/* PROGRESS */}
          <div className="space-y-2">
            <div className="w-full bg-white/30 h-2 rounded-full" />

            <div className="flex justify-between">
              <div className="h-3 w-20 bg-white/30 rounded" />
              <div className="h-3 w-10 bg-white/30 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Button */}
      <section className="px-4 pb-4 flex">
        <div className="flex flex-1 items-center justify-center gap-2 py-6 bg-white/5 font-semibold text-white rounded-2xl">
          <div className="h-4 w-16 bg-white/20 rounded" />
          <div className="h-4 w-24 bg-white/20 rounded" />
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
