import { useMemo, useState } from "react";
import EmptyState from "../../../shared/ui/EmptyState";
import { useGroupTransactionsByDate } from "../../transactions/hooks/useGroupTransactionsByDate";
import TransactionGroupMobile from "../../transactions/components/TransactionGroupMobile";
import { useBalance } from "../../../shared/context/BalanceContext";
import type { Transaction } from "../../transactions/types/transaction";
import { useNavigate } from "react-router-dom";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import DashboardSectionAccountBalanceSummary from "./DashboardSectionAccountBalanceSummary";
import { useDashboardData } from "../hooks/useDashboardData";
import { toast } from "sonner";
import { useTransactionActions } from "../../transactions/hooks/useTransactionActions";
import BottomSheet from "../../../shared/ui/BottomSheet";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  refetch: () => void;
}

export default function DashboardMobile({ transactions, accounts, categories, refetch }: Props) {
  console.log(transactions);
  
  const navigate = useNavigate();
  const { hideBalance, setHideBalance } = useBalance();

  // ✅ Ambil 10 transaksi terakhir
  const latestTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 15);
  }, [transactions]);

  const grouped = useGroupTransactionsByDate(latestTransactions);
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

  const { summary, accountsWithBalance } = useDashboardData({ transactions, accounts, categories, refetch });

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
      {isEmpty ? (
        <EmptyState
          title="No transactions"
          subtitle="No recent transactions"
        />
      ) : (
        <>
          <div className="p-4">
            <div className="flex flex-col">
              <span className="text-sm text-slate-400">Total Balance</span>
              <div className="flex items-center gap-4">
                <span className="text-2xl text-black font-semibold">{formatBalance(formatCurrency(summary.balance), hideBalance)}</span>
                {hideBalance !== undefined && setHideBalance && (
                  hideBalance ? (
                    <ViewIcon
                      onClick={() => setHideBalance(false)}
                      className="text-slate-900 hover:text-slate-500 cursor-pointer" size={24} />
                  ) : (
                    <ViewOffSlashIcon
                      onClick={() => setHideBalance(true)}
                      className="text-slate-900 hover:text-slate-500 cursor-pointer" size={24} />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="px-4 py-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-400">Accounts Balance</span>
              <DashboardSectionAccountBalanceSummary accounts={accountsWithBalance} autoScroll={false} />
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

          <div className="p-4">
            <button
              onClick={() => navigate("/transactions")}
              className="w-full py-2 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 cursor-pointer"
            >
              View all transactions
            </button>
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
      )}
    </>
  );
}