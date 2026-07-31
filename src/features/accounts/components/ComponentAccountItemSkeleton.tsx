import Skeleton from "react-loading-skeleton";

export default function ComponentAccountItemSkeleton() {
  return (
    <div className="border-b border-slate-50 p-4 bg-white">
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-6">
          <Skeleton circle width={32} height={32} />

          <div className="space-y-2">
            <Skeleton width={90} height={12} />
            <Skeleton width={140} height={20} />
          </div>
        </div>

        <div className="space-y-2 text-right">
          <Skeleton width={80} height={12} />
          <Skeleton width={120} height={20} />
        </div>

      </div>
    </div>
  );
}