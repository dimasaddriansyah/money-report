import { useMemo } from "react";
import type { Transaction } from "../../types/Transactions";
import TransactionItem from "./TransactionItem";
import { formatRupiah } from "../../helpers/Format";

interface Props {
  date: string;
  transactions: Transaction[];
  openSwipe: string | null;
  setOpenSwipe: (id: string | null) => void;
}

export default function TransactionGroup({
  date,
  transactions,
  openSwipe,
  setOpenSwipe,
}: Props) {
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const totalExpenses = useMemo(() => {
    return transactions.reduce((total, trx) => {
      if (trx.type === "expenses") {
        return total + trx.nominal;
      }
      return total;
    }, 0);
  }, [transactions]);

  return (
    <div>
      <div className="px-4 py-3 flex justify-between items-center text-sm font-semibold text-slate-500 bg-slate-50">
        <span className="text-slate-500">{formattedDate}</span>
        <span className="text-red-500">{formatRupiah(totalExpenses)}</span>
      </div>

      <ul className="divide-y divide-slate-100/40">
        {transactions.map((trx) => (
          <TransactionItem
            key={trx.transaction_id}
            trx={trx}
            openSwipe={openSwipe}
            setOpenSwipe={setOpenSwipe}
          />
        ))}
      </ul>
    </div>
  );
}
