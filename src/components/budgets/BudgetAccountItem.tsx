import { ArrowDown01Icon, Wallet01Icon } from "hugeicons-react";
import { formatRupiah } from "../../helpers/Format";
import { useState } from "react";
import type { Budgets } from "../../types/Budgets";
import type { Transactions } from "../../types/Transactions";
import { useBudgetDetailStatus } from "../../hooks/budgets/useBudgetDetailStatus";
import BudgetAccountDetail from "./BudgetAccountItemDetail";

interface Props {
  account: string;
  items: Budgets[];
  transactions: Transactions[];
  getProgressStyles: (value: number) => {
    bar: string;
    text: string;
  };
}

export default function BudgetAccountItem({
  account,
  items,
  transactions,
  getProgressStyles,
}: Props) {
  const [open, setOpen] = useState(false);

  const detailStatuses = useBudgetDetailStatus(items, transactions);

  const totalBudgetAccount = items.reduce((sum, item) => sum + item.nominal, 0);

  const totalUsedAccount = detailStatuses.reduce(
    (sum, item) => sum + item.used,
    0,
  );

  const percentage =
    totalBudgetAccount > 0
      ? Math.min(Math.floor((totalUsedAccount / totalBudgetAccount) * 100), 100)
      : 0;

  const styles = getProgressStyles(percentage);

  return (
    <li className="p-4 space-y-4">
      <div className="flex justify-between items-center gap-3">
        <div className="flex gap-3 items-center">
          <div className="flex justify-center items-center bg-indigo-50 rounded-lg p-2">
            <Wallet01Icon className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Account</div>
            <div className="font-medium text-slate-900">{account}</div>
          </div>
        </div>
        <ArrowDown01Icon
          onClick={() => {
            {
              setOpen((prev) => !prev);
              console.log("Detail Status:", detailStatuses);
            }
          }}
          size={20}
          className={`text-slate-400 cursor-pointer transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Rp 0</span>
          <span className="text-xs text-slate-900 font-medium">
            {formatRupiah(totalBudgetAccount)}
          </span>
        </div>
        <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full ${styles.bar} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm space-x-1">
            <span className="font-semibold">
              {formatRupiah(totalUsedAccount)}
            </span>
            <span className="text-slate-400">terpakai</span>
          </div>
          <span className={`text-xs font-medium ${styles.text}`}>
            {percentage}%
          </span>
        </div>
      </div>

      <BudgetAccountDetail open={open} items={detailStatuses} />
    </li>
  );
}
