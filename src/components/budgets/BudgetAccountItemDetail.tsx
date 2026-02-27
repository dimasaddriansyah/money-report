import { formatRupiah } from "../../helpers/Format";
import type { BudgetDetailStatus } from "../../hooks/budgets/useBudgetDetailStatus";

interface DetailItem {
  budget: {
    budget_id: string;
    remark: string;
    nominal: number;
  };
  used: number;
  status: BudgetDetailStatus;
  percentage: number;
}

interface Props {
  open: boolean;
  items: DetailItem[];
}

export default function BudgetAccountDetail({ open, items }: Props) {
  return (
    <section
      className={`overflow-hidden transition-all duration-300 ${
        open ? "max-h-130 mt-2" : "max-h-0"
      }`}
    >
      <div className="space-y-3">
        <div className="bg-slate-100/60 p-2 text-slate-800 font-medium text-sm rounded-md">
          Detail budget
        </div>

        {items.map((item) => (
          <div
            key={item.budget.budget_id}
            className="flex justify-between items-center text-sm"
          >
            <div className="flex flex-col">
              <span className="text-slate-700">{item.budget.remark}</span>

              <span className="text-xs text-slate-400">
                {formatRupiah(item.used)} / {formatRupiah(item.budget.nominal)}
              </span>
            </div>

            {item.status === "DONE" && (
              <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                Done
              </span>
            )}

            {item.status === "IN_PROGRESS" && (
              <span className="text-xs px-2 py-1 bg-amber-50 text-amber-600 rounded-full">
                Ongoing
              </span>
            )}

            {item.status === "OVER" && (
              <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full">
                Over
              </span>
            )}

            {item.status === "NOT_USED" && (
              <span className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-full">
                Not Used
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
