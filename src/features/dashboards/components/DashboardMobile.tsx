import { useEffect, useMemo, useRef, useState } from "react";
import EmptyState from "../../../shared/ui/EmptyState";
import { useGroupTransactionsByDate } from "../../transactions/hooks/useGroupTransactionsByDate";
import TransactionGroupMobile from "../../transactions/components/mobile/TransactionGroupMobile";
import { useBalance } from "../../../shared/context/BalanceContext";
import type { Transaction } from "../../transactions/types/transaction";
import { useNavigate } from "react-router-dom";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { ArrowDown01Icon, Delete02Icon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import DashboardSectionAccountBalanceSummary from "./DashboardSectionAccountBalanceSummary";
import { useDashboardData } from "../hooks/useDashboardData";
import { toast } from "sonner";
import { useTransactionActions } from "../../transactions/hooks/useTransactionActions";
import BottomSheet from "../../../shared/ui/BottomSheet";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import DashboardSectionLayoutCategoryExpense from "./DashboardSectionLayoutCategoryExpense";
import { useDashboardFilter } from "../hooks/useDashboardFilter";

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  refetch: () => void;
}

export default function DashboardMobile({ transactions, accounts, categories, refetch }: Props) {
  const navigate = useNavigate();
  const { hideBalance, setHideBalance } = useBalance();

  const { period, setPeriod, filteredTransactions } = useDashboardFilter({ transactions });

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

  const periods = [
    { label: "Year", value: "year" },
    { label: "Month", value: "month" },
    { label: "Week", value: "week" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Today", value: "today" },
  ];
  const [openFilter, setOpenFilter] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => { document.removeEventListener("mousedown", handleClickOutside) }
  }, []);

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
          <div className="px-4 py-10 bg-slate-50">
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Total Balance</span>
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

          <section className="flex flex-col m-4 p-4 bg-white border border-slate-100 rounded-lg gap-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Category Expense</h4>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenFilter(!openFilter)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-2 text-sm hover:bg-slate-50 cursor-pointer">
                  <span className="text-sm text-black">{periods.find((p) => p.value === period)?.label}</span>
                  <ArrowDown01Icon size={16} className={`transition-transform ${openFilter ? "rotate-180" : ""}`} />
                </button>
                {openFilter && (
                  <div className="absolute right-0 z-50 mt-2 w-45 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    {periods.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => {
                          setPeriod(item.value)
                          setOpenFilter(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-lg p-3 text-sm hover:bg-slate-100 cursor-pointer
                          ${period === item.value ? "bg-slate-100 font-semibold" : ""}`}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="h-px bg-slate-100/60" />
            <DashboardSectionLayoutCategoryExpense transactions={filteredTransactions} categories={categories} />
          </section>

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
            <div className="flex flex-col p-4 gap-4">
              <p className="text-sm text-slate-500">Delete "<span className="text-black font-semibold">{selectedTransaction?.remark}</span>"? This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-sm text-white font-semibold disabled:opacity-50 cursor-pointer">
                  <div className="flex items-center justify-center gap-2">
                    <Delete02Icon size={16} />
                    {loading ? "Deleting..." : "Delete Budget"}
                  </div>
                </button>
              </div>
            </div>
          </BottomSheet>
        </>
      )}
    </>
  );
}