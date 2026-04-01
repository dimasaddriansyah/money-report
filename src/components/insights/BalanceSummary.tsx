import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";

interface Props {
  balance: number;
  income: number;
  expenses: number;
  transfer: number;
  hideBalance: boolean;
  setHideBalance: React.Dispatch<React.SetStateAction<boolean>>;
  formatRupiah: (value: number) => string;
}

export default function BalanceSummary({
  balance,
  income,
  expenses,
  transfer,
  hideBalance,
  setHideBalance,
  formatRupiah,
}: Props) {
  return (
    <section className="p-4 flex flex-col gap-4">
      {/* Balance */}
      <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
        <div className="flex flex-col">
          <span className="text-sm text-white/60">Balance</span>
          <span className="text-2xl text-white font-semibold">
            {hideBalance ? "Rp •••••••••••" : formatRupiah(balance)}
          </span>
        </div>

        <button
          onClick={() => setHideBalance((prev) => !prev)}
          className="cursor-pointer"
        >
          {hideBalance ? (
            <ViewIcon strokeWidth={2} className="text-white" />
          ) : (
            <ViewOffSlashIcon strokeWidth={2} className="text-white" />
          )}
        </button>
      </div>

      {/* Income & Expenses */}
      <div className="flex gap-4 py-2">
        <div className="flex-1">
          <span className="text-sm text-white/60">Income</span>
          <div className="text-base text-white font-medium">
            {hideBalance ? "Rp •••••••••••" : formatRupiah(income)}
          </div>
        </div>

        <div className="flex-1">
          <span className="text-sm text-white/60">Expenses</span>
          <div className="text-base text-white font-medium">
            {hideBalance ? "Rp •••••••••••" : formatRupiah(expenses)}
          </div>
        </div>

        <div className="flex-1">
          <span className="text-sm text-white/60">Transfer</span>
          <div className="text-base text-white font-medium">
            {hideBalance ? "Rp •••••••••••" : formatRupiah(transfer)}
          </div>
        </div>
      </div>
    </section>
  );
}
