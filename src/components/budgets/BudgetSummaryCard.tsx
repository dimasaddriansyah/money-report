import { Edit01Icon, Wallet01Icon } from "hugeicons-react";
import { formatRupiah } from "../../helpers/Format";

interface Props {
  balance: number;
  totalBudget: number;
  totalAllocated: number;
  percentage: number;
  styles: {
    bar: string;
    badge: string;
  };
}

export default function BudgetSummaryCard({
  balance,
  totalBudget,
  totalAllocated,
  percentage,
  styles,
}: Props) {
  return (
    <section className="mx-4 mt-4 mb-6">
      <div className="bg-white p-4 rounded-2xl flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <div className="flex justify-center items-center bg-blue-50 rounded-lg p-2">
              <Wallet01Icon className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-base text-slate-900">
                Total Budget
              </span>
              <span className="text-xs text-slate-400">
                Pantau penggunaan budget
              </span>
            </div>
          </div>
          <div className="px-2 text-sm bg-amber-50 font-medium flex items-center rounded-lg gap-2 border text-amber-500 hover:bg-amber-100/70 cursor-pointer">
            <Edit01Icon className="w-4 h-4" />
            <span>Edit</span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-2xl font-bold">{formatRupiah(balance)}</span>
          <span className="text-xs text-slate-400">
            dari total {formatRupiah(totalBudget)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${styles.bar} rounded-full transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between">
            <div className="text-xs space-x-1">
              <span className="text-slate-900 font-medium">
                {formatRupiah(totalAllocated)}
              </span>
              <span className="text-slate-400">terpakai</span>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}
            >
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
