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
        open ? "max-h-200 mt-2" : "max-h-0"
      }`}
    >
      <div className="divide-y divide-slate-100/60">
        <div className="bg-slate-100/60 p-2 text-slate-800 font-medium text-sm rounded-md">
          Detail budget
        </div>

        {items.map((item) => (
          <div
            key={item.budget.budget_id}
            className="flex justify-between items-center text-sm py-3"
          >
            <div className="flex flex-col">
              <span className="text-slate-900 font-medium">
                {item.budget.remark}
              </span>

              <div className="">
                <span className="text-xs text-slate-900">
                  {formatRupiah(item.used)}
                </span>
                <span className="text-xs text-slate-400">
                  {" "}
                  / {formatRupiah(item.budget.nominal)}
                </span>
              </div>
            </div>

            {item.status === "DONE" && (
              <span className="text-xs px-2 py-1 bg-green-50 text-green-600 font-semibold rounded-full">
                Done
              </span>
            )}
            {item.status === "IN_PROGRESS" && (
              <span className="text-xs px-2 py-1 bg-amber-50 text-amber-600 font-semibold rounded-full">
                Ongoing
              </span>
            )}
            {item.status === "OVER" && (
              <span className="text-xs px-2 py-1 bg-red-50 text-red-600 font-semibold rounded-full">
                Over
              </span>
            )}
            {item.status === "NOT_USED" && (
              <span className="text-xs px-2 py-1 bg-slate-50 text-slate-600 font-semibold rounded-full">
                Not Used
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
