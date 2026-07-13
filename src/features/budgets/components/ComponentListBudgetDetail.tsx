import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";

type BudgetItem = {
  id: string;
  accountId: string | null;
  accountName: string;
  remark: string;
  amount: number;
  spent: number;
  remaining: number;
  progress: number;
  isOverBudget: boolean;
};

type Props = {
  items: BudgetItem[];
  hideBalance: boolean;
};

export default function ComponentListBudgetDetail({
  items,
  hideBalance,
}: Props) {
  return (
    <div className="m-4 flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl space-y-4 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={getAccountsImg(item.accountName)} alt={item.accountName} className="w-10 h-10 object-contain" />
              <div className="flex flex-col">
                <p className="text-xs text-slate-600">{item.accountName}</p>
                <p className="text-sm font-medium text-black ">{item.remark}</p>
              </div>
            </div>
            <span className={`rounded-lg px-2 py-1 text-xs font-semibold 
              ${item.isOverBudget
                ? "bg-red-100 text-red-600 border border-red-200"
                : "bg-green-100 text-green-600 border border-green-200"}`}>
              {item.isOverBudget ? "Over Budget" : "Safe"}
            </span>
          </div>

          <div className="my-3 h-px bg-slate-100" />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Budget</span>
              <span>{formatBalance(formatCurrency(item.amount), hideBalance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Spent</span>
              <span className="text-red-500">{formatBalance(formatCurrency(item.spent), hideBalance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Remaining</span>
              <span>{formatBalance(formatCurrency(item.remaining), hideBalance)}</span>
            </div>
          </div>

          <div className="relative h-5 overflow-hidden rounded-full bg-slate-100">
            <div className={`absolute left-0 top-0 h-full ${item.isOverBudget ? "bg-red-300" : "bg-green-300"}`}
              style={{ width: `${item.progress}%` }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-black">
                {item.progress.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}