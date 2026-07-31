import Skeleton from "react-loading-skeleton";

export default function TransactionItemMobileSkeleton() {
  return (
    <div className="border-b border-slate-50 bg-white p-4">
      <div className="flex items-center gap-4">
        <Skeleton circle width={40} height={40} />
        <div className="flex-1 flex flex-col gap-1">
          <Skeleton width={70} height={20} borderRadius={9999} />
          <div className="flex justify-between">
            <div>
              <Skeleton width={170} height={24} />
              <Skeleton width={90} height={20}/>
            </div>
            <Skeleton width={80} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
}