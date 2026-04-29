import { useState } from "react";
import { useBalance } from "../../../shared/context/BalanceContext";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { groupBudgetByAccount } from "../utils/groupBudgetByAccount.helper";
import BottomSheet from "../../../shared/ui/BottomSheet";
import { getAccountsImg } from "../../../shared/utils/style.helper";

type BudgetGroup = {
  accountId: string;
  accountName: string;
  total: number;
  color?: string;
  items?: BudgetGroup[];
};

type Props = {
  totalUsage: number;
  percentUsage: number;
  grouped: BudgetGroup[];
};

export default function ComponentCardListTrasnfer({
  totalUsage,
  percentUsage,
  grouped,
}: Props) {
  const { hideBalance } = useBalance();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BudgetGroup | null>(null);
  const groupedFinal = groupBudgetByAccount(grouped);
  const current = selected;

  return (
    <div className="m-4 border border-slate-200 rounded-xl bg-white">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <span className="text-sm font-semibold">List Transfer</span>
          <div className="flex px-2 py-1 rounded-full bg-blue-100 text-blue-600 gap-1">
            <span className="text-xs font-semibold">{formatBalance(formatCurrency(totalUsage), hideBalance)}</span>
            <span className="text-xs font-semibold">
              ({hideBalance ? "••" : percentUsage}%)
            </span>
          </div>
        </div>

        <div className="p-4 grid grid-cols-3 gap-4">
          {groupedFinal.map((budget) => (
            <div
              key={budget.accountId}
              onClick={() => {
                setSelected(budget);
                setOpen(true);
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 active:scale-95">
              <span className="text-xs text-slate-500"> {budget.accountName} </span>
              <div className={`w-full h-1 rounded-full ${budget.color ?? "bg-slate-400"}`} />
              <span className="text-xs font-semibold">
                {formatBalance(formatCurrency(budget.total), hideBalance)}
              </span>
            </div>
          ))}
        </div>
        <BottomSheet
          open={open}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
          title={current ? `List Transfer ${current.accountName}` : ""} >
          {current && (
            <div className="flex flex-col">
              {current.items?.length ? (
                <>
                  {current.items
                    .slice()
                    .sort((a, b) => b.total - a.total)
                    .map((item) => (
                      <div
                        key={item.accountId}
                        className="flex justify-between px-4 py-3 text-sm border-b border-slate-50 hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                          <img src={getAccountsImg(item.accountName)} alt={item.accountName} className="w-8 h-8" />
                          <span className="text-slate-500">{item.accountName}</span>
                        </div>
                        <span className="font-medium text-slate-500">
                          {formatBalance(formatCurrency(item.total), hideBalance)}
                        </span>
                      </div>
                    ))}
                  <div className="flex justify-between bg-slate-50 p-4 text-sm font-semibold">
                    <span>Total</span>
                    <span>
                      {formatBalance(formatCurrency(current.total), hideBalance)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-4">
                      <img src={getAccountsImg(current.accountName)} alt={current.accountName} className="w-8 h-8" />
                      <span className="text-slate-500">{current.accountName}</span>
                    </div>
                    <span className="font-medium text-slate-500">
                      {formatBalance(formatCurrency(current.total), hideBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between bg-slate-50 p-4 text-sm font-semibold">
                    <span>Total</span>
                    <span>
                      {formatBalance(formatCurrency(current.total), hideBalance)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </BottomSheet>
      </div >
    </div >
  );
}