import { useState } from "react";
import { NoteEditIcon, Delete02Icon } from "hugeicons-react";
import { formatRupiah } from "../../helpers/Format";
import type { BudgetDetailStatus } from "../../hooks/budgets/useBudgetDetailStatus";
import { useNavigate } from "react-router-dom";

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
  onDelete?: (item: DetailItem) => void;
  onDeleteRequest: (id: string) => void;
}

export default function BudgetAccountDetail({
  open,
  items,
  onDeleteRequest,
}: Props) {
  const navigate = useNavigate();

  const [startX, setStartX] = useState(0);
  const [swipe, setSwipe] = useState<Record<string, number>>({});

  return (
    <section
      className={`overflow-hidden transition-all duration-300 ${
        open ? "max-h-200 mt-2" : "max-h-0"
      }`}
    >
      <div className="divide-y divide-slate-50/90 bg-slate-100 rounded-xl overflow-hidden">
        <div className="px-2 py-3 text-slate-900 font-medium text-sm">
          Detail Budget
        </div>

        {items.map((item, index) => {
          return (
            <div
              key={item.budget.budget_id}
              className="relative overflow-hidden"
            >
              {/* ACTIONS */}
              <div className="absolute inset-y-0 right-0 flex">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/budget/edit/${item.budget.budget_id}`, {
                      state: { budget: item },
                    });
                  }}
                  className="w-16 flex justify-center items-center bg-yellow-50 text-yellow-500"
                >
                  <NoteEditIcon />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRequest(item.budget.budget_id);
                  }}
                  className="w-16 flex justify-center items-center bg-red-50 text-red-500"
                >
                  <Delete02Icon />
                </button>
              </div>

              {/* CONTENT */}
              <div
                onTouchStart={(e) => {
                  setStartX(e.touches[0].clientX);
                }}
                onTouchMove={(e) => {
                  const currentX = e.touches[0].clientX;
                  const deltaX = currentX - startX;

                  let newTranslate =
                    (swipe[item.budget.budget_id] || 0) - deltaX;

                  if (newTranslate < 0) newTranslate = 0;
                  if (newTranslate > 128) newTranslate = 128;

                  setSwipe((prev) => ({
                    ...prev,
                    [item.budget.budget_id]: newTranslate,
                  }));

                  setStartX(currentX);
                }}
                onTouchEnd={() => {
                  const current = swipe[item.budget.budget_id] || 0;

                  setSwipe((prev) => ({
                    ...prev,
                    [item.budget.budget_id]: current > 64 ? 128 : 0,
                  }));
                }}
                style={{
                  transform: `translateX(-${swipe[item.budget.budget_id] || 0}px)`,
                }}
                className={`flex justify-between items-center text-sm py-3 px-2 
                  ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  relative z-10 transition-transform duration-200 touch-pan-y select-none`}
              >
                <div className="flex flex-col">
                  <span className="text-slate-900 font-medium">
                    {item.budget.remark}
                  </span>

                  <div>
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
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 font-semibold rounded-full">
                    Done
                  </span>
                )}
                {item.status === "IN_PROGRESS" && (
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-600 font-semibold rounded-full">
                    Ongoing
                  </span>
                )}
                {item.status === "OVER" && (
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-600 font-semibold rounded-full">
                    Over
                  </span>
                )}
                {item.status === "NOT_USED" && (
                  <span className="text-xs px-2 py-1 bg-slate-200 text-slate-600 font-semibold rounded-full">
                    Not Used
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
