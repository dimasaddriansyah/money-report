import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useGroupedTransactions } from "../hooks/useGroupedTransactions";
import { useMonthNavigation } from "../hooks/useMonthNavigation";
import Header from "../components/Header";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import CurrentBalance from "../components/dashboards/CurrentBalance";
import PaymentBalances from "../components/dashboards/PaymentBalances";
import { MONTHS } from "../helpers/Format";
import TransactionGroup from "../components/dashboards/TransactionGroup";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import { useLocalStorage } from "../hooks/useLocalStorage";

const PAGE_SIZE = 20;

export default function Dashboard() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openSwipe, setOpenSwipe] = useState<string | null>(null);

  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false);

  const { monthIndex, year, prev, next, startDate, endDate } =
    useMonthNavigation();
  const selectedMonth = MONTHS[monthIndex];

  const { transactions, currentBalance, loading } = useTransactions(
    startDate,
    endDate,
  );

  const { flatTransactions, visibleGrouped, visibleDates } =
    useGroupedTransactions(transactions, visibleCount);

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-700">
        <Header title="Cashflow 2026" textColor="text-white" />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-700">
      <Header title="Cashflow 2026" textColor="text-white" />

      <MonthNavigator
        selectedMonth={selectedMonth}
        year={year}
        onPrev={prev}
        onNext={next}
      />

      <CurrentBalance
        balance={currentBalance}
        hide={hideBalance}
        toggle={() => setHideBalance((prev) => !prev)}
      />

      <PaymentBalances transactions={transactions} hide={hideBalance} />

      <section className="bg-white rounded-t-3xl">
        {visibleDates.map((date) => (
          <TransactionGroup
            key={date}
            date={date}
            transactions={visibleGrouped[date]}
            openSwipe={openSwipe}
            setOpenSwipe={setOpenSwipe}
          />
        ))}

        {!loading && visibleCount < flatTransactions.length && (
          <div className="mb-28 mt-2 px-6">
            <button
              className="w-full border border-stone-400 text-slate-800 py-2 rounded-lg"
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
