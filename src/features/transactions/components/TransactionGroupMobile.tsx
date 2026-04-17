import { formatDateFull, formatCurrency } from "../../../shared/utils/format.helper";
import type { Transaction } from "../types/transaction";
import ComponentTransactionItem from "./TransactionItemMobile";

type Props = {
  group: TransactionGroup;
  accountMap: Record<string, string>;
  categoryMap: Record<string, string>;
  hideBalance: boolean;
  activeSwipeId: string | null;
  setActiveSwipeId: (id: string | null) => void;
  navigate: (path: string) => void;
  setSelectedTransaction: (trx: Transaction) => void;
  setOpen: (val: boolean) => void;
};

type TransactionGroup = {
  date: string;
  totalExpense: number;
  items: Transaction[];
};

export default function TransactionGroupMobile({
  group,
  accountMap,
  categoryMap,
  hideBalance,
  activeSwipeId,
  setActiveSwipeId,
  navigate,
  setSelectedTransaction,
  setOpen,
}: Props) {
  return (
    <div>
      <div className="flex justify-between px-4 py-3 bg-slate-100">
        <span className="text-sm text-slate-500 font-semibold">{formatDateFull(group.date)}</span>
        <span className="text-sm text-slate-500 font-semibold">{formatCurrency(group.totalExpense)}</span>
      </div>
      {group.items.map((row) => (
        <ComponentTransactionItem
          key={row.id}
          row={row}
          accountMap={accountMap}
          categoryMap={categoryMap}
          hideBalance={hideBalance}
          isOpen={activeSwipeId === row.id}
          onOpen={() => setActiveSwipeId(row.id)}
          onClose={() => setActiveSwipeId(null)}
          onEdit={() => navigate(`/transaction/edit/${row.id}`)}
          onDelete={() => { setSelectedTransaction(row); setOpen(true) }} />
      ))}
    </div>
  );
}