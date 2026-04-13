import type { Budget } from "../types/budget";

export default function BudgetMobile({ budgets }: { budgets: Budget[]; }) {
  return (
    <div className="space-y-2">
      {budgets.map((row, index) => (
        <div
          key={`${row.id}-${index}`}
          className="p-4 bg-white rounded-xl border"
        >
          <p className="text-sm text-slate-500">Budget</p>
          <p className="font-medium text-slate-900">
            {row.remark}
          </p>
        </div>
      ))}
    </div>
  );
}