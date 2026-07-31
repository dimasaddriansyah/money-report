import Skeleton from "react-loading-skeleton";

export default function DashboardMobileSkeleton() {
  return (
    <div className="bg-white">
      <div className="px-4 py-10 bg-slate-50">
        <Skeleton width={100} height={20} />
        <Skeleton width={220} height={32} />
      </div>

      <div className="px-4 py-2 flex flex-col gap-1">
        <Skeleton width={120} height={20} />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="min-w-60 p-4 flex gap-4 bg-white rounded-xl border border-slate-200 ">
              <Skeleton width={32} height={32} borderRadius={8} />
              <div className="flex flex-col">
                <Skeleton width={100} height={20} />
                <Skeleton width={60} height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="m-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex justify-between">
          <Skeleton width={130} height={20} />
          <Skeleton width={90} height={34} />
        </div>
        <Skeleton
          className="mt-5"
          height={220}
          borderRadius={12} />
      </section>

      <div className="bg-white">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-slate-100 p-4">
            <div className="flex gap-3">
              <Skeleton
                circle
                width={40}
                height={40} />
              <div className="flex-1">
                <div className="flex justify-between">
                  <Skeleton width={150} height={18} />
                  <Skeleton width={80} height={18} />
                </div>
                <Skeleton
                  className="mt-2"
                  width={100}
                  height={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4"><Skeleton height={42} borderRadius={12} /></div>
    </div>
  );
}