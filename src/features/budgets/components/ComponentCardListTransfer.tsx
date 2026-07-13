import { useMemo, useState } from "react";
import type { Account } from "../../accounts/types/account";
import type { Budget } from "../types/budget";
import { groupBudgetByOriginalAccount } from "../utils/groupBudgetByOriginalAccount.helper";
import {
  formatBalance,
  formatCurrency,
} from "../../../shared/utils/format.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import BottomSheet from "../../../shared/ui/BottomSheet";

type AllocationItem = {
  accountId: string;
  accountName: string;
  total: number;
  percent: number;
  items: Budget[];
};

type Props = {
  items: AllocationItem[];
  summary: {
    budgetAmount: number;
    totalAllocation: number;
    remainingBudget: number;
    remainingPercent: number;
    isOverBudget: boolean;
  };
  accounts: Account[];
  hideBalance: boolean;
};

export default function ComponentCardListTransfer({
  items,
  summary,
  accounts,
  hideBalance,
}: Props) {
  const [selected, setSelected] = useState<AllocationItem | null>(null);

  const breakdownAccounts = useMemo(
    () =>
      selected
        ? groupBudgetByOriginalAccount(selected.items, accounts)
        : [],
    [selected, accounts]
  );

  return (
    <>
      <div className="m-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div
          className={`flex items-center justify-between border-b border-slate-200 p-4 
            ${summary.isOverBudget ? "bg-red-50" : "bg-green-50"}`}>
          <div>
            <p className="text-sm font-semibold">Save Allocation</p>
            <p className={`text-sm font-semibold ${summary.isOverBudget ? "text-red-500" : "text-green-500"}`}>
              {summary.isOverBudget ? "Over Budget!" : "Save Budget"}
            </p>
          </div>

          <span className={`text-sm font-semibold ${summary.isOverBudget ? "text-red-500" : "text-green-500"}`}>
            {formatBalance(formatCurrency(summary.remainingBudget), hideBalance)}
          </span>
        </div>

        {items.map((item) => (
          <div
            key={item.accountId}
            onClick={() => setSelected(item)}
            className="flex cursor-pointer items-center justify-between border-b border-slate-50 px-4 py-3 hover:bg-slate-50">
            <div className="flex items-center gap-4">
              <img src={getAccountsImg(item.accountName)} alt={item.accountName} className="h-8 w-8" />
              <span className="text-sm text-slate-600">{item.accountName}</span>
            </div>
            <span className="text-sm text-slate-600">{formatBalance(formatCurrency(item.total), hideBalance)}</span>
          </div>
        ))}

        <div className="flex items-center justify-between bg-slate-50 p-4">
          <span className="text-sm font-semibold">Total Allocation</span>
          <span className="text-sm font-semibold">{formatBalance(formatCurrency(summary.totalAllocation), hideBalance)}
          </span>
        </div>
      </div>

      <BottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.accountName} Budget` : "Budget"}>
        {selected && (
          <div className="flex flex-col">
            {breakdownAccounts.map((item) => (
              <div
                key={item.accountId}
                className="flex items-center justify-between border-b border-slate-50 px-4 py-3">
                <div className="flex items-center gap-4">
                  <img src={getAccountsImg(item.accountName)} alt={item.accountName} className="h-8 w-8" />
                  <span className="text-sm text-slate-500">{item.accountName}</span>
                </div>
                <span className="text-sm text-slate-500">{formatBalance(formatCurrency(item.total), hideBalance)}</span>
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