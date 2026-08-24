import { useNavigate } from "react-router-dom";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import { getAccountStyle } from "../../transactions/utils/ui.helpers";

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
  const navigate = useNavigate();
  return (
    <div className="m-4 flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`/budget/edit/${item.id}`)}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer overflow-hidden">
          <div className={`flex items-center justify-between p-4 border-0 gap-6 ${getAccountStyle(item.accountName)}`}>
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
          <div className="flex flex-col p-4 gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Budget</span>
              <span className="text-slate-600 tabular-nums">{formatBalance(formatCurrency(item.amount), hideBalance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Spent</span>
              <span className="font-medium text-red-500 tabular-nums">{formatBalance(formatCurrency(item.spent), hideBalance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Remaining</span>
              <span className="text-slate-600 tabular-nums">{formatBalance(formatCurrency(item.remaining), hideBalance)}</span>
            </div>
          </div>
          <div className="mx-4 mb-4 relative overflow-hidden rounded-full bg-slate-100">
            <div className={`py-1.5 ${item.isOverBudget ? "bg-red-500" : "bg-green-500"}`}
              style={{ width: `${item.progress}%` }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[10px] font-semibold ${item.progress > 55 ? "text-white" : "text-black"}`}>
                {item.progress.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}