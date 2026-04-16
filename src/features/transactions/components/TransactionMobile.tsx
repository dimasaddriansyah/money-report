import { useNavigate } from "react-router-dom";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import type { Transaction } from "../types/transaction";
import { useBalance } from "../../../shared/context/BalanceContext";
import { useMemo, useState } from "react";
import { useTransactionActions } from "../hooks/useTransactionActions";
import { toast } from "sonner";
import EmptyState from "../../../shared/ui/EmptyState";
import { useGroupTransactionsByDate } from "../hooks/useGroupTransactionsByDate";
import TransactionGroupMobile from "./TransactionGroupMobile";
import BottomSheet from "../../../shared/ui/BottomSheet";
import { useTransactionPeriod } from "../hooks/useTransactionPeriod";
import TransactionComponentFilterDate from "./TransactionComponentFilterDate";
import TransactionComponentFilterAccount from "./TransactionComponentFilterAccount";

export default function TransactionMobile({
  transactions,
  accounts,
  categories,
  refetch }: {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    refetch: () => void;
  }) {
  const navigate = useNavigate();
  const { hideBalance } = useBalance();
  const { start, end, prev, next, isCurrentPeriod } = useTransactionPeriod();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const txDate = new Date(t.date);

      const matchDate = txDate >= start && txDate <= end;

      const matchAccount = selectedAccountId
        ? (
          t.fromAccountId === selectedAccountId ||
          t.toAccountId === selectedAccountId
        )
        : true;

      return matchDate && matchAccount;
    });
  }, [transactions, start, end, selectedAccountId]);

  const grouped = useGroupTransactionsByDate(filteredTransactions);
  const isEmpty = grouped.length === 0;

  const accountMap = useMemo(
    () => Object.fromEntries(accounts.map(row => [row.id, row.name])),
    [accounts]
  );

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map(row => [row.id, row.name])),
    [categories]
  );

  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeSwipeId, setActiveSwipeId] = useState<string | null>(null);

  const { deleteTransaction, loading } = useTransactionActions(refetch);
  async function handleDelete() {
    if (!selectedTransaction) return;
    try {
      const result = await deleteTransaction(selectedTransaction.id);
      toast.success("Deleted", {
        description: result.message,
      });
      setOpen(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      toast.error("Failed to delete", {
        description: error.message,
      });
    }
  }

  return (
    <>
      <div className="bg-white">
        <TransactionComponentFilterDate period={{ start, end, prev, next, isCurrentPeriod }} />

        <TransactionComponentFilterAccount
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onSelect={setSelectedAccountId} />

        {isEmpty ? (
          <EmptyState
            title="No transactions"
            subtitle="No data in this period"
          />
        ) : (
          grouped.map((group) => (
            <TransactionGroupMobile
              key={group.date}
              group={group}
              accountMap={accountMap}
              categoryMap={categoryMap}
              hideBalance={hideBalance}
              activeSwipeId={activeSwipeId}
              setActiveSwipeId={setActiveSwipeId}
              navigate={navigate}
              setSelectedTransaction={setSelectedTransaction}
              setOpen={setOpen}
            />
          ))
        )}
      </div>
      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedTransaction(null);
        }}
        title="Delete Transaction">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500">
            {selectedTransaction
              ? `Delete "${selectedTransaction.remark}"? This cannot be undone.`
              : ""}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setOpen(false);
                setSelectedTransaction(null);
              }}
              className="flex-1 py-2 rounded-xl hover:bg-slate-50 border border-slate-200 text-sm text-slate-400 cursor-pointer">
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm text-white font-medium disabled:opacity-50 cursor-pointer">
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}