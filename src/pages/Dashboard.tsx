import { useState } from "react";
import AccountBalances from "../components/dashboards/AccountBalances";
import CurrentBalance from "../components/dashboards/CurrentBalance";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import TransactionGroup from "../components/dashboards/TransactionGroup";
import DesktopLayout from "../components/utils/DesktopLayout";
import EmptyState from "../components/utils/EmptyState";
import MobileLayout from "../components/utils/MobileLayout";
import { useLocalStorage } from "../hooks/utils/useLocalStorage";
import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import { MONTHS } from "../helpers/Format";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useGroupedTransactions } from "../hooks/transactions/useGroupedTransactions";

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

  return (
    <>
      {/* DESKTOP */}
      <DesktopLayout>
        {/* HEADER */}
        <div className="px-4 h-14 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
          <span className="text-base font-semibold">HEADER CONTENT</span>
          <MonthNavigator
            variant="desktop"
            selectedMonth={selectedMonth}
            onPrev={prev}
            onNext={next}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4">HAI</div>

        {/* FOOTER */}
        <div className="px-4 h-12 flex items-center justify-between text-xs text-slate-400 bg-white border-t border-slate-100 shrink-0">
          <span>CASHFLOW v1.0</span>
          <span>Copyright &#169; 2026</span>
        </div>
      </DesktopLayout>

      {/* MOBILE */}
      <MobileLayout>
        <MonthNavigator
          variant="mobile"
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
            <EmptyState />
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
      </MobileLayout>
    </>
  );
}
