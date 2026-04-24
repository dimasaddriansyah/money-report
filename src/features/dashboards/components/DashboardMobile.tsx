import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { useBalance } from "../../../shared/context/BalanceContext";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import TransactionComponentFilterDate from "../../transactions/components/TransactionComponentFilterDate";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import TransactionGroupMobile from "../../transactions/components/TransactionGroupMobile";
import { useMemo, useState } from "react";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import { useGroupTransactionsByDate } from "../../transactions/hooks/useGroupTransactionsByDate";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";
import { useNavigate } from "react-router-dom";
import type { Transaction } from "../../transactions/types/transaction";

export default function DashboardMobile() {
  const navigate = useNavigate();
  const { hideBalance, setHideBalance } = useBalance();
  const { start, end, prev, next, isCurrentPeriod } = useTransactionPeriod();

  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();

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

  const [visibleCount, setVisibleCount] = useState(15);
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredTransactions]);

  const visibleTransactions = useMemo(() => {
    return sortedTransactions.slice(0, visibleCount);
  }, [sortedTransactions, visibleCount]);

  const grouped = useGroupTransactionsByDate(visibleTransactions);
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

  return (
    <>
      <TransactionComponentFilterDate period={{ start, end, prev, next, isCurrentPeriod }} />

      <div className="flex flex-col p-4">
        <span className="text-sm text-slate-400">Total Balance</span>
        <div className="flex items-center gap-4">
          <span className="text-2xl text-black font-bold">{formatBalance(formatCurrency(200000), hideBalance)}</span>
          {hideBalance ? (
            <ViewIcon
              onClick={() => setHideBalance(false)}
              className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer" />
          ) : (
            <ViewOffSlashIcon
              onClick={() => setHideBalance(true)}
              className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer" />
          )}
        </div>
      </div>

      <div className="flex flex-col p-4">
        <span className="text-sm text-slate-400">My Accounts</span>
        <div className="flex items-center gap-4">
          <div>CARD</div>
        </div>
      </div>

      {grouped.map((group) => (
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
      ))}
      {visibleCount < filteredTransactions.length && (
        <div className="p-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 15)}
            className="w-full py-2 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 cursor-pointer">
            Load more transaction
          </button>
        </div>
      )}
    </>
  )
}