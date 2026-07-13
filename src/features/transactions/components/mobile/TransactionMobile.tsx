import { useNavigate } from "react-router-dom";
import type { Account } from "../../../accounts/types/account";
import type { Category } from "../../../categories/types/category";
import type { Transaction } from "../../types/transaction";
import { useBalance } from "../../../../shared/context/BalanceContext";
import { useMemo, useState } from "react";
import { useTransactionActions } from "../../hooks/useTransactionActions";
import { toast } from "sonner";
import EmptyState from "../../../../shared/ui/EmptyState";
import { useGroupTransactionsByDate } from "../../hooks/useGroupTransactionsByDate";
import TransactionGroupMobile from "./TransactionGroupMobile";
import { useTransactionPeriod } from "../../hooks/useTransactionPeriod";
import TransactionComponentFilterDate from "../TransactionComponentFilterDate";
import { Invoice01Icon } from "hugeicons-react";
import TransactionComponentFilter from "../TransactionComponentFilter";
import { useSortedTransactions } from "../../hooks/useSortedTransactions";
import { useTransactionInfinite } from "../../hooks/useTransactionInfinite";
import TransactionDeleteSheet from "./TransactionDeleteSheet";
import { useTransactionMobileFilter } from "../../hooks/useTransactionMobileFilter";
import { createLookup } from "../../../../shared/utils/lookup.helper";

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  refetch: () => Promise<void>;
}

export default function TransactionMobile({
  transactions,
  accounts,
  categories,
  refetch
}: Props) {
  const navigate = useNavigate();
  const { hideBalance } = useBalance();
  const { start, end, prev, next, isCurrentPeriod, isMaxPeriod } = useTransactionPeriod();

  const { filteredTransactions, selectedType, setSelectedType, selectedAccount, setSelectedAccount,
    selectedCategory, setSelectedCategory } = useTransactionMobileFilter({
      transactions,
      start,
      end,
    });

  const sortedTransactions = useSortedTransactions(filteredTransactions);

  const { visibleTransactions, visibleCount, loadMore } = useTransactionInfinite(sortedTransactions);

  const grouped = useGroupTransactionsByDate(visibleTransactions);
  const isEmpty = grouped.length === 0;

  const accountLookup = useMemo(
    () => createLookup(accounts),
    [accounts]
  );

  const categoryLookup = useMemo(
    () => createLookup(categories),
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
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error("Failed to delete", {
        description: message,
      });
    }
  }

  return (
    <>
      <div className="bg-white">
        <TransactionComponentFilterDate period={{ start, end, prev, next, isCurrentPeriod, isMaxPeriod }} />

        <TransactionComponentFilter
          accounts={accounts}
          categories={categories}
          selectedType={selectedType}
          selectedAccount={selectedAccount}
          selectedCategory={selectedCategory}
          onChangeType={setSelectedType}
          onChangeAccount={setSelectedAccount}
          onChangeCategory={setSelectedCategory} />

        {isEmpty ? (
          <EmptyState
            title="No transactions"
            subtitle="No data in this period"
            icon={<Invoice01Icon />} />
        ) : (
          grouped.map((group) => (
            <TransactionGroupMobile
              key={group.date}
              group={group}
              accountMap={accountLookup}
              categoryMap={categoryLookup}
              hideBalance={hideBalance}
              activeSwipeId={activeSwipeId}
              setActiveSwipeId={setActiveSwipeId}
              navigate={navigate}
              setSelectedTransaction={setSelectedTransaction}
              setOpen={setOpen} />
          ))
        )}
        {visibleCount < filteredTransactions.length && (
          <div className="p-4">
            <button
              onClick={loadMore}
              className="w-full py-2 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 cursor-pointer">
              Load more transaction
            </button>
          </div>
        )}
      </div>
      <TransactionDeleteSheet
        open={open}
        loading={loading}
        transaction={selectedTransaction}
        onDelete={handleDelete}
        onClose={() => {
          setOpen(false);
          setSelectedTransaction(null);
        }} />
    </>
  );
}