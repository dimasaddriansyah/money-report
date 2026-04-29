import { Add01Icon, Delete02Icon, NoteEditIcon } from "hugeicons-react";
import EmptyState from "../../../shared/ui/EmptyState";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import type { Account } from "../../accounts/types/account";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import type { Transaction } from "../../transactions/types/transaction";
import { useBudgetGetBudget } from "../hooks/useBudgetGetBudget";
import { useBudgetGroupedByAccount } from "../hooks/useBudgetGroupedByAccount";
import type { Budget } from "../types/budget";
import { getTransactionMap } from "../utils/getTransactionMap.helper";
import { useBalance } from "../../../shared/context/BalanceContext";
import { groupBudgetByAccount } from "../utils/groupBudgetByAccount.helper";
import { useState } from "react";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import { getSpentByBudget } from "../utils/getSpentByBudget.helper";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  transactions: Transaction[];
  refetch: () => void;
};

type BudgetGroup = {
  accountId: string;
  accountName: string;
  total: number;
  color?: string;
  items?: BudgetGroup[];
};

export default function BudgetDesktop({
  budgets,
  accounts,
  transactions
}: Props) {
  const { hideBalance } = useBalance();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BudgetGroup | null>(null);

  const { start, end, prev, next, isCurrentPeriod, isMaxPeriod } = useTransactionPeriod(true);
  const grouped = useBudgetGroupedByAccount({ budgets, start, end, accounts });
  const isEmpty = grouped.length === 0;

  const groupedFinal = groupBudgetByAccount(grouped);

  const budgetPrimary = useBudgetGetBudget({ budgets, start })
  const transactionMap = getTransactionMap(transactions, start);

  const totalUsage = grouped.reduce((sum, g) => sum + g.total, 0);
  const percentUsage =
    budgetPrimary?.amount
      ? Math.min(Math.round((totalUsage / budgetPrimary.amount) * 100), 100)
      : 0

  return (
    <>
      {isEmpty ? (
        <EmptyState
          title="No budgets yet"
          subtitle="Create your first budget to start tracking" />
      ) : (
        <>
          <div className="flex gap-4 items-start">
            <div className="w-[70%]">
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <span className="text-base text-black font-medium">List Budget</span>
                  <button className="flex items-center px-3 py-2 bg-black hover:bg-slate-900 border text-white text-sm rounded-lg gap-2 cursor-pointer">
                    <Add01Icon size={20} />
                    <span className="font-semibold">Add Budget</span>
                  </button>
                </div>
                <div className="flex flex-col">
                  {grouped.map((group) => (
                    <div key={group.accountId}>
                      <div className="flex justify-between px-4 py-3 bg-slate-100">
                        <div className="flex items-center gap-3">
                          <img src={getAccountsImg(group.accountName)} alt={group.accountName} className="w-6 h-6" />
                          <span className="text-sm font-semibold text-slate-500">{group.accountName}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-500">{formatBalance(formatCurrency(group.total), hideBalance)}</span>
                      </div>

                      <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
                        <thead className="bg-slate-200 text-sm text-left text-slate-500">
                          <th className="w-10">#</th>
                          <th className="w-50">Remark</th>
                          <th>Budget</th>
                          <th>Spent</th>
                          <th>Status</th>
                          <th className="w-30 text-center">Action</th>
                        </thead>
                        <tbody>
                          {group.budgets.map((b, index) => {
                            const ACCOUNT_USE_CATEGORY = ["ACC005", "ACC006"];
                            const isCategoryBased = ACCOUNT_USE_CATEGORY.includes(group.accountId);
                            const spent = isCategoryBased
                              ? getSpentByBudget(b.remark, b.accountId, transactionMap)
                              : transactionMap.byRemark[b.remark?.toLowerCase() ?? ""] ?? 0;
                            const percent =
                              b.amount > 0
                                ? Math.min(Math.round((spent / b.amount) * 100), 100)
                                : 0;
                            const status =
                              percent > 100 ? "Over"
                                : percent >= 100 ? "Pass"
                                  : percent >= 70 ? "Warning"
                                    : "Safe";
                            const statusStyleMap: Record<string, string> = {
                              Over: "bg-red-100 border border-red-200 text-red-600",
                              Pass: "bg-blue-100 border border-blue-200 text-blue-600",
                              Warning: "bg-yellow-100 border border-yellow-200 text-yellow-600",
                              Safe: "bg-green-100 border border-green-200 text-green-600",
                            };

                            return (
                              <tr className="hover:bg-slate-50">
                                <td className="text-sm text-slate-400">{index + 1}.</td>
                                <td className="text-sm">{b.remark}</td>
                                <td className="text-sm font-semibold">{formatBalance(formatCurrency(b.amount), hideBalance)}</td>
                                <td className="text-sm text-slate-500">{formatBalance(formatCurrency(spent), hideBalance)}</td>
                                <td className="text-xs font-medium">
                                  <span className={`px-2 py-1 rounded-full ${statusStyleMap[status]}`}>{status}</span>
                                </td>
                                <td className="flex gap-2 text-xs font-medium">
                                  <button className="p-2 bg-amber-50 hover:bg-amber-200 rounded-xl cursor-pointer">
                                    <NoteEditIcon size={20} className="text-amber-500" />
                                  </button>
                                  <button className="p-2 bg-red-50 hover:bg-red-200 rounded-xl cursor-pointer">
                                    <Delete02Icon size={20} className="text-red-500" />
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-[30%] space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <span className="text-base text-black font-medium">Budget This Month</span>
                  <button className="flex items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 border text-white text-sm rounded-lg gap-2 cursor-pointer">
                    <NoteEditIcon size={20} />
                    <span className="font-semibold">Edit</span>
                  </button>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-sm text-slate-400">Total Budget</span>
                  <span className="text-base font-semibold">{formatBalance(formatCurrency(budgetPrimary.amount), hideBalance)}</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <span className="text-base font-semibold">List Transfer</span>
                    <div className="flex px-2 py-1 rounded-full bg-blue-100 text-blue-600 gap-1">
                      <span className="text-xs font-semibold">{formatBalance(formatCurrency(totalUsage), hideBalance)}</span>
                      <span className="text-xs font-semibold">
                        ({hideBalance ? "••" : percentUsage}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {groupedFinal.map((budget) => (
                      <div
                        key={budget.accountId}
                        onClick={() => {
                          setSelected(budget);
                          setOpen(true);
                        }}
                        className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <img src={getAccountsImg(budget.accountName)} alt={budget.accountName} className="w-8 h-8" />
                          <span className="text-sm text-slate-500">{budget.accountName}</span>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatBalance(formatCurrency(budget.total), hideBalance)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div >
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

