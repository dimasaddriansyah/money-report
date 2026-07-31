import Skeleton from "react-loading-skeleton";

export default function BudgetMobileSkeleton() {
  return (
    <div className="bg-white">

      {/* Filter Date */}
      <div className="p-4 border-b border-slate-100">
        <Skeleton height={40} borderRadius={12} />
      </div>

      {/* Total Budget Card */}
      <div className="m-4 rounded-2xl border border-slate-200 p-5 space-y-4">
        <Skeleton width={120} height={16} />
        <Skeleton width={180} height={34} />
        <Skeleton width="100%" height={12} />
      </div>

      {/* Create Budget Button */}
      <div className="px-4">
        <Skeleton height={44} borderRadius={12} />
      </div>

      {/* Transfer Card */}
      <div className="m-4 rounded-2xl border border-slate-200 p-5">
        <Skeleton width={140} height={18} />

        <div className="mt-4 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Skeleton circle width={36} height={36} />

                <div>
                  <Skeleton width={120} height={16} />
                  <Skeleton width={70} height={14} />
                </div>
              </div>

              <Skeleton width={70} height={18} />
            </div>
          ))}
        </div>
      </div>

      {/* Budget Detail */}
      <div className="m-4 rounded-2xl border border-slate-200 p-5">
        <Skeleton width={150} height={18} />

        <div className="mt-4 space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <div className="flex justify-between">
                <Skeleton width={120} height={18} />
                <Skeleton width={70} height={18} />
              </div>

              <Skeleton
                className="mt-3"
                height={8}
                borderRadius={999}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}