import { useMemo, useState } from "react";
import type { Transactions } from "../../types/Transactions";
import TransactionItem from "./TransactionItem";
import { formatRupiah } from "../../helpers/Format";
import BottomSheet from "../utils/BottomSheet";

interface Props {
  date: string;
  transactions: Transactions[];
  openSwipe: string | null;
  setOpenSwipe: (id: string | null) => void;
  onDeleteConfirm: (transactionId: string) => Promise<boolean>;
}

export default function TransactionGroup({
  date,
  transactions,
  openSwipe,
  setOpenSwipe,
  onDeleteConfirm,
}: Props) {
  const [selectedTrx, setSelectedTrx] = useState<Transactions | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (!selectedTrx) return;

    try {
      setLoadingDelete(true);
      await onDeleteConfirm(selectedTrx.transaction_id);
      setSelectedTrx(null);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div>
      <div className="px-4 py-3 flex justify-between items-center text-sm font-semibold text-slate-500 bg-slate-50">
        <span>{formattedDate}</span>
        <span className="text-red-500">{formatRupiah(totalExpenses)}</span>
      </div>

      <ul className="divide-y divide-slate-100/40">
        {transactions.map((trx) => (
          <TransactionItem
            key={trx.transaction_id}
            trx={trx}
            openSwipe={openSwipe}
            setOpenSwipe={setOpenSwipe}
            onDeleteRequest={(trx) => setSelectedTrx(trx)}
          />
        ))}
      </ul>

      {/* Bottom Sheet Confirmation */}
      <BottomSheet
        open={!!selectedTrx}
        onClose={() => setSelectedTrx(null)}
        title="Hapus Transaksi"
      >
        {selectedTrx && (
          <div className="">
            <div className="pt-4 pb-8">
              <p>
                Yakin ingin menghapus transaksi{" "}
                <strong>{selectedTrx.remark}</strong>?
              </p>
            </div>
            <button
              onClick={handleConfirmDelete}
              disabled={loadingDelete}
              className="w-full bg-red-500 text-white py-3 rounded-lg flex items-center justify-center min-h-12"
            >
              {loadingDelete ? (
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                </span>
              ) : (
                "Hapus"
              )}
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
