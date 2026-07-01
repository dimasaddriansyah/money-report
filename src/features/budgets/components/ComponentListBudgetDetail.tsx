import { useNavigate } from "react-router-dom";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import type { Budget } from "../types/budget";

type Props = {
  budgets: Budget[];
  spendingMap: Map<string, number>;
  accountMap: Map<string, string>;
  hideBalance: boolean;
};

export default function ComponentListBudgetDetail({ budgets, spendingMap, accountMap, hideBalance }: Props) {
  const navigate = useNavigate();

  return (
    <div className="p-4 grid grid-cols-1 gap-4">
      {budgets.map((item) => {
        const spending = spendingMap.get(item.id) ?? 0;
        const isCappedBudget = item.accountId === "ACC005" && item.remark === "Uang Bersama";
        const displaySpending = isCappedBudget ? Math.min(spending, item.amount) : spending;
        const saving = item.amount - displaySpending;
        const percent =
          item.amount > 0
            ? Math.round((displaySpending / item.amount) * 100)
            : 0;

        const isOverBudget = spending > item.amount;
        const accountName = accountMap.get(item.accountId) ?? "Unknown Account";

        return (
          <div
            key={item.id}
            onClick={() => navigate(`/budget/edit/${item.id}`)}
            className="bg-white border border-slate-200 hover:bg-slate-100 rounded-lg p-4 flex flex-col transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={getAccountsImg(accountName)} alt={accountName} className="w-8 h-8" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-slate-400">{accountName}</span>
                  <div className="text-sm font-semibold text-black truncate">{item.remark}</div>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border 
                ${isOverBudget
                  ? "bg-red-50 text-red-500 border-red-200"
                  : "bg-green-50 text-green-500 border-green-200"
                }`}>
                {isOverBudget ? "Over Budget" : "Safe"}
              </span>
            </div>
            <div className="my-3 h-px bg-slate-100" />
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Budgeting</span>
                  <span className="text-xs text-slate-500">{formatBalance(formatCurrency(item.amount), hideBalance)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Spending</span>
                  <span className={`text-xs ${isOverBudget ? "text-red-500 font-semibold" : "text-slate-500"}`}>
                    {formatBalance(formatCurrency(displaySpending), hideBalance)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Saving</span>
                  <span className={`text-xs ${saving < 0 ? "text-red-500 font-semibold" : "text-slate-500"}`}>
                    {formatBalance(formatCurrency(saving), hideBalance)}
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isOverBudget ? "bg-red-500" : "bg-green-600"}`}
                    style={{ width: `${Math.min(percent, 100)}%` }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-[10px] font-bold ${percent > 55 ? "text-white" : "text-black"}`}>{percent}%</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}