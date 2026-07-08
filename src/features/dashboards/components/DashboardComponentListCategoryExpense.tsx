import { useMemo, useState } from "react";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { useBalance } from "../../../shared/context/BalanceContext";
import Modal from "../../../shared/ui/Modal";
import DashboardComponenChartCategoryExpense from "./DashboardComponenChartCategoryExpense";
import { useIsMobile } from "../../../shared/hooks/useIsMobile";
import BottomSheet from "../../../shared/ui/BottomSheet";

type Props = {
  data: {
    categoryId: string;
    name: string;
    total: number;
    count: number;
    color: string;
  }[];
};

export function DashboardComponentListCategoryExpense({ data }: Props) {
  const isMobile = useIsMobile();
  const { hideBalance } = useBalance();
  const [open, setOpen] = useState(false);

  const dataWithPercentage = useMemo(() => {
    const totalExpense = data.reduce((sum, item) => sum + item.total, 0);

    return [...data]
      .sort((a, b) => b.total - a.total)
      .map((item) => ({
        ...item,
        percentage:
          totalExpense === 0 ? 0 : (item.total / totalExpense) * 100,
      }));
  }, [data]);

  const top4 = dataWithPercentage.slice(0, 4);

  const chartData = useMemo(() => {
    const top4 = dataWithPercentage.slice(0, 4);
    const others = dataWithPercentage.slice(4);

    if (!others.length) return top4;

    return [
      ...top4,
      {
        categoryId: "other",
        name: "Other",
        total: others.reduce((sum, item) => sum + item.total, 0),
        count: others.reduce((sum, item) => sum + item.count, 0),
        percentage: others.reduce((sum, item) => sum + item.percentage, 0),
        color: "#62748e",
      },
    ];
  }, [dataWithPercentage]);

  return (
    <>
      {/* Preview */}
      <div className="space-y-3 -mt-25 z-1">
        {top4.map((item) => (
          <div
            key={item.categoryId}
            className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />

              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-slate-400">
                  {item.count} transaksi
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">
                {formatBalance(formatCurrency(item.total), hideBalance)}
              </p>
              <p className="text-xs text-slate-400">
                {item.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}

        {dataWithPercentage.length > 4 && (
          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-2xl border border-slate-100 px-4 py-3 text-sm font-medium transition hover:bg-black hover:text-white cursor-pointer"
          >
            Show more
          </button>
        )}
      </div>

      {open &&
        (isMobile ? (
          <BottomSheet
            open={open}
            title="Transaction by Category"
            onClose={() => setOpen(false)}
          >
            <div className="flex flex-col gap-5 p-4">
              {/* Segmented Progress */}
              <div className="flex gap-0.5">
                {chartData.map((item) => (
                  <div
                    key={item.categoryId}
                    className="flex h-8 items-center justify-center overflow-hidden whitespace-nowrap text-xs font-medium text-white first:rounded-l-full last:rounded-r-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                    title={`${item.name} (${item.percentage.toFixed(1)}%)`}
                  >
                    {item.percentage >= 10
                      ? `${item.percentage.toFixed(1)}%`
                      : ""}
                  </div>
                ))}
              </div>

              {/* List */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {dataWithPercentage.map((item) => (
                  <div
                    key={item.categoryId}
                    className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />

                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-slate-400">
                          {item.count} transaksi
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatBalance(
                          formatCurrency(item.total),
                          hideBalance
                        )}
                      </p>

                      <p className="text-xs text-slate-400">
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BottomSheet>
        ) : (
          <Modal
            size="xl"
            title="Transaction by Category"
            onClose={() => setOpen(false)}
          >
            <div className="grid grid-cols-12 gap-4 p-4">
              <div className="col-span-4 flex items-center justify-center">
                <DashboardComponenChartCategoryExpense
                  full
                  data={dataWithPercentage.map((item) => ({
                    name: item.name,
                    value: item.total,
                    color: item.color,
                  }))}
                />
              </div>

              <div className="col-span-8">
                <div className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto pr-2">
                  {dataWithPercentage.map((item) => (
                    <div
                      key={item.categoryId}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />

                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-slate-400">
                            {item.count} transaksi
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatBalance(
                            formatCurrency(item.total),
                            hideBalance
                          )}
                        </p>

                        <p className="text-xs text-slate-400">
                          {item.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        ))}
    </>
  );
}