import { useState } from "react";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useGroupedTransactions } from "../hooks/transactions/useGroupedTransactions";
import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import CurrentBalance from "../components/dashboards/CurrentBalance";
import AccountBalances from "../components/dashboards/AccountBalances";
import { MONTHS } from "../helpers/Format";
import TransactionGroup from "../components/dashboards/TransactionGroup";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import { useLocalStorage } from "../hooks/utils/useLocalStorage";
import EmptyState from "../components/utils/EmptyState";
import { InvoiceIcon } from "hugeicons-react";

export default function Dashboard() {
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openSwipe, setOpenSwipe] = useState<string | null>(null);
  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false);
  const { monthIndex, prev, next, startDate, endDate } = useMonthNavigation();
  const selectedMonth = MONTHS[monthIndex];
  const {
    transactions,
    allTransactions,
    currentBalance,
    loading,
    deleteTransaction,
  } = useTransactions(startDate, endDate);
  const { flatTransactions, visibleGrouped, visibleDates } =
    useGroupedTransactions(transactions, visibleCount);
  const isEmpty = flatTransactions.length === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 flex flex-col">
      <span className="bg-slate-50"></span>
      {/* <Header title="Cashflow 2026" textColor="text-white" /> */}

      <MonthNavigator
        selectedMonth={selectedMonth}
        onPrev={prev}
        onNext={next}
        startDate={startDate}
        endDate={endDate}
      />

      <CurrentBalance
        balance={currentBalance}
        hide={hideBalance}
        toggle={() => setHideBalance((prev) => !prev)}
      />

      <AccountBalances transactions={allTransactions} hide={hideBalance} />

      <section
        className={`bg-white rounded-t-3xl overflow-hidden flex flex-col ${
          isEmpty ? "flex-1 min-h-dvh" : "pb-24"
        }`}
      >
        <div
          className={`${isEmpty ? "bg-white" : "bg-slate-50"} h-8 flex items-center`}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300" />
        </div>
        {isEmpty ? (
          <EmptyState icon={<InvoiceIcon/>} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow." />
        ) : (
          <>
            {visibleDates.map((date) => (
              <TransactionGroup
                key={date}
                date={date}
                transactions={visibleGrouped[date]}
                openSwipe={openSwipe}
                setOpenSwipe={setOpenSwipe}
                onDeleteConfirm={deleteTransaction}
              />
            ))}
          </>
        )}

        {!loading && visibleCount < flatTransactions.length && (
          <div className="my-4 px-4">
            <button
              className="w-full border border-slate-200 text-slate-900 py-3 rounded-lg cursor-pointer hover:bg-slate-200 text-sm font-medium transition-all"
              onClick={() => setVisibleCount((p) => p + PAGE_SIZE)}
            >
              Load more data
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
