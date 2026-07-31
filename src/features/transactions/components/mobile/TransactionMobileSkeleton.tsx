import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TransactionItemMobileSkeleton from "./TransactionItemMobileSkeleton";

export default function TransactionMobileSkeleton() {
  return (
    <div className="bg-white">
      <div className="flex justify-between py-3 px-4 gap-4">
        <Skeleton circle width={38} height={38} />
        <Skeleton width={120} height={38} borderRadius={10} />
        <Skeleton circle width={38} height={38} />
      </div>
      <div className="flex gap-2  py-3 px-4 border-b border-slate-100">
        <Skeleton width={130} height={38} borderRadius={20} />
        <Skeleton width={152} height={38} borderRadius={20} />
        <Skeleton width={162} height={38} borderRadius={20} />
      </div>
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex}>
          <div className="flex justify-between px-4 py-3 bg-slate-100">
            <Skeleton width={130} />
            <Skeleton width={70} />
          </div>
          {Array.from({ length: 3 }).map((_, itemIndex) => (
            <TransactionItemMobileSkeleton key={itemIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}