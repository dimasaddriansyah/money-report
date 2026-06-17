import { useState } from "react";
import type { Account } from "../../accounts/types/account";
import type { groupBudgetByAccount } from "../utils/groupBudgetByAccount.helper";
import { groupBudgetByOriginalAccount } from "../utils/groupBudgetByOriginalAccount.helper";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import BottomSheet from "../../../shared/ui/BottomSheet";

type Props = {
  grouped: ReturnType<typeof groupBudgetByAccount>;
  accounts: Account[];
  budgetAmount: number;
  hideBalance: boolean;
};

export default function ComponentCardListTransfer({
  grouped,
  budgetAmount,
  accounts,
  hideBalance,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof grouped)[number] | null>(null);

  const breakdownAccounts = selected
    ? groupBudgetByOriginalAccount(selected.items, accounts)
    : [];

  const totalAllocation = grouped.reduce((sum, item) => sum + item.total, 0);
  const isOverBudget = totalAllocation > budgetAmount;

  return (
    <>
      <div className="m-4 border border-slate-200 rounded-xl bg-white overflow-hidden">
        <div className="flex flex-col">
          <div className={`flex items-center justify-between p-4 border-b border-slate-200 ${isOverBudget ? "bg-red-50" : "bg-green-50"}`}>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Budget Allocation</span>
              <span className={`text-sm font-semibold ${isOverBudget ? "text-red-500" : "text-green-500"}`}>{isOverBudget ? "Over Budget!" : "Safe Budget"}</span>
            </div>
            <span className={`text-sm font-semibold ${isOverBudget ? "text-red-500" : "text-green-500"}`}>{formatBalance(formatCurrency(totalAllocation), hideBalance)}</span>
          </div>

          {grouped.map((budget) => (
            <div
              key={budget.accountId}
              onClick={() => {
                setSelected(budget);
                setOpen(true);
              }}
              className="flex items-center justify-between px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-4">
                <img src={getAccountsImg(budget.accountName)} alt={budget.accountName} className="w-8 h-8" />
                <span className="text-sm text-slate-600">{budget.accountName}</span>
              </div>
              <span className="text-sm text-slate-600">{formatBalance(formatCurrency(budget.total), hideBalance)}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        title={selected ? `${selected.accountName} Budget` : "Budget"}>
        {selected && (
          <div className="flex flex-col">
            {breakdownAccounts.map((item) => (
              <div
                key={item.accountId}
                className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <img src={getAccountsImg(item.accountName)} alt={item.accountName} className="w-8 h-8" />
                  <span className="text-sm text-slate-500">{item.accountName}</span>
                </div>
                <span className="text-sm text-slate-500">
                  {formatBalance(formatCurrency(item.total), hideBalance)}
                </span>
              </div>
            ))}

            <div className="flex justify-between bg-slate-50 p-4 text-sm font-semibold">
              <span>Total</span>
              <span>{formatBalance(formatCurrency(selected.total), hideBalance)}</span>
            </div>
          </div>
        )}
      </BottomSheet>
    </>
  );
}