import { ArrowDown01Icon } from "hugeicons-react";
import { formatRupiah } from "../../helpers/Format";
import { useState } from "react";
import type { Budgets } from "../../types/Budgets";
import type { Transactions } from "../../types/Transactions";
import { useBudgetDetailStatus } from "../../hooks/budgets/useBudgetDetailStatus";
import BudgetAccountDetail from "./BudgetAccountItemDetail";
import { getAccountsImg } from "../../helpers/UI";

interface Props {
  account: string;
  items: Budgets[];
  transactions: Transactions[];
  getProgressStyles: (value: number) => {
    bar: string;
    text: string;
  };
  onDeleteRequest: (id: string) => void;
}

export default function BudgetAccountItem({
  account,
  items,
  transactions,
  getProgressStyles,
  onDeleteRequest,
}: Props) {
  const [open, setOpen] = useState(false);

  const detailStatuses = useBudgetDetailStatus(items, transactions);

  const totalBudgetAccount = items.reduce((sum, item) => sum + item.nominal, 0);

  const totalUsedAccount = detailStatuses.reduce(
    (sum, item) => sum + item.used,
    0,
  );

  const remaining = totalBudgetAccount - totalUsedAccount;

  const percentage =
    totalBudgetAccount > 0
      ? Math.min(Math.floor((totalUsedAccount / totalBudgetAccount) * 100), 100)
      : 0;

  const styles = getProgressStyles(percentage);

  return (
    <li className="p-4 space-y-4">
      <div className="flex justify-between items-center gap-3">
        <div className="flex gap-4 items-center">
          <img
            src={`${getAccountsImg(account)}`}
            alt={`${account}`}
            className="w-9 h-9"
          />
          <div>
            <div className="text-xs text-slate-400">Account</div>
            <div className="font-medium text-slate-900">{account}</div>
          </div>
        </div>
        <ArrowDown01Icon
          onClick={() => {
            {
              setOpen((prev) => !prev);
            }
          }}
          size={20}
          className={`text-slate-400 cursor-pointer transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-900 font-medium">
            {formatRupiah(totalUsedAccount)}
          </span>
          <span className="text-sm text-slate-900 font-medium">
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
            <span className="font-semibold">{formatRupiah(remaining)}</span>
            <span className="text-slate-400">tersisa</span>
          </div>
          <span className={`text-xs font-medium ${styles.text}`}>
            {percentage}%
          </span>
        </div>
      </div>

      <BudgetAccountDetail
        open={open}
        items={detailStatuses}
        onDeleteRequest={onDeleteRequest}
      />
    </li>
  );
}
