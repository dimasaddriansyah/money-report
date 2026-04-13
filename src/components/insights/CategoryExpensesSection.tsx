import { InvoiceIcon } from "hugeicons-react";
import EmptyState from "../utils/EmptyState";
import CategoriesChart from "./CategoriesChart";

interface Props {
  isEmpty: boolean;
  pieData: any;
  COLORS: string[];
  visibleCategories: any[];
  categorySummary: any[];
  showAllCategories: boolean;
  setShowAllCategories: React.Dispatch<React.SetStateAction<boolean>>;
  formatRupiah: (value: number) => string;
  hideBalance: boolean;
}

export default function CategoryExpensesSection({
  isEmpty,
  pieData,
  COLORS,
  visibleCategories,
  categorySummary,
  showAllCategories,
  setShowAllCategories,
  formatRupiah,
  hideBalance
}: Props) {
  return (
    <section className="bg-white rounded-2xl p-4">
      <span className="text-base font-semibold">
        Expenses by Category
      </span>
      <div className="h-px bg-slate-100/60 my-3" />

      {isEmpty ? (
        <EmptyState icon={<InvoiceIcon />} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow." />
      ) : (
        <>
          <CategoriesChart data={pieData} colors={COLORS} hideBalance={hideBalance} />

          {visibleCategories.length > 0 && (
            <div className="space-y-3 -mt-15">
              {visibleCategories.map((item, i) => {
                const color = COLORS[i] || COLORS[COLORS.length - 1];

                return (
                  <div
                    key={item.name}
                    className="flex justify-between items-center border border-slate-200/60 rounded-2xl px-4 py-3 hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-5 h-2 mt-2 rounded-sm"
                        style={{ background: color }}
                      />

                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {item.count} transaksi
                        </span>
                      </div>
                    </div>

                    <span className="text-sm font-semibold">
                      {hideBalance ? "Rp ••••••" : formatRupiah(item.total)}
                    </span>
                  </div>
                );
              })}

              {categorySummary.length > 4 && (
                <button
                  onClick={() =>
                    setShowAllCategories((prev) => !prev)
                  }
                  className="w-full border border-slate-200/60 rounded-2xl px-4 py-3 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                >
                  {showAllCategories ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}