import { useState } from "react";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { useBalance } from "../../../shared/context/BalanceContext";
import Modal from "../../../shared/ui/Modal";
import DashboardComponenChartCategoryExpense from "./DashboardComponenChartCategoryExpense";

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
  const { hideBalance } = useBalance();
  const [open, setOpen] = useState(false);
  const visible = data.slice(0, 4);

  return (
    <>
      <div className="space-y-3 -mt-25">
        {visible.map((item) => (
          <div
            key={item.categoryId}
            className="flex justify-between items-center border border-slate-200/60 rounded-2xl px-4 py-3 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-start gap-3">
              <span
                className="w-5 h-2 mt-2 rounded-sm"
                style={{ background: item.color }}
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
              {formatBalance(formatCurrency(item.total), hideBalance)}
            </span>
          </div>
        ))}
        {data.length > 4 && (
          <button
            onClick={() => setOpen(true)}
            className="w-full border border-slate-200/60 rounded-2xl px-4 py-3 text-sm font-medium hover:bg-slate-50 cursor-pointer">
            Show more
          </button>
        )}
      </div>
      {open && (
        <Modal
          size="xl"
          title="Category Expense"
          onClose={() => {
            setOpen(false);
          }}>
          <div className="grid grid-cols-[30%_70%] gap-4">
            <div className="flex items-center justify-center">
              <DashboardComponenChartCategoryExpense
                data={data.map(item => ({
                  name: item.name,
                  value: item.total,
                  color: item.color,
                }))}
              />
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-2">
                {data.map((item) => (
                  <div
                    key={item.categoryId}
                    className="flex items-center justify-between border border-slate-200/60 rounded-xl px-4 py-3 hover:bg-slate-100 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span
                        className="w-5 h-2 mt-2 rounded-sm"
                        style={{ background: item.color }} />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-xs text-slate-400">{item.count} transaksi</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatBalance(formatCurrency(item.total), hideBalance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}