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
import {
  ArrowDown01Icon,
  Menu01Icon,
  Notification01Icon,
  PlusSignIcon,
  Search01Icon,
} from "hugeicons-react";

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
        {({ collapsed, setCollapsed }: any) => (
          <>
            {/* HEADER */}
            <div className="px-6 h-18 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="cursor-pointer"
              >
                <Menu01Icon size={20} className="text-slate-900" />
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-6">
                  <Search01Icon className="w-5 h-5 text-slate-900" />
                  <Notification01Icon className="w-5 h-5 text-slate-900" />
                </div>
                <div className="w-px h-8 bg-neutral-100"></div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      Dimas Addriansyah
                    </span>
                    <span className="text-xs text-slate-400">Owner</span>
                  </div>
                  <ArrowDown01Icon className="h-5 w-5 text-neutral-400" />
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex flex-col flex-1 overflow-y-auto px-6 py-8 gap-6">
              <div className="flex justify-between gap-6">
                <button className="flex items-center px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl gap-2 cursor-pointer">
                  <PlusSignIcon className="w-5 h-5 text-white" />
                  <span>Add Transaction</span>
                </button>
                <button className="flex items-center px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl gap-2 cursor-pointer">
                  <PlusSignIcon className="w-5 h-5 text-white" />
                  <span>Add Transaction</span>
                </button>
              </div>
              <div className="flex justify-between gap-6">
                <section className="flex-1 bg-white rounded-2xl p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-slate-400">Total Balance</span>
                    <h1 className="text-2xl font-bold">Rp 20.000</h1>
                  </div>
                </section>
                <section className="flex-1 bg-white rounded-2xl p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-slate-400">Total Income</span>
                    <h1 className="text-2xl font-bold">Rp 20.000</h1>
                  </div>
                </section>
                <section className="flex-1 bg-white rounded-2xl p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-slate-400">Total Expenses</span>
                    <h1 className="text-2xl font-bold">Rp 20.000</h1>
                  </div>
                </section>
                <section className="flex-1 bg-white rounded-2xl p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-slate-400">Total Transactions</span>
                    <h1 className="text-2xl font-bold">Rp 20.000</h1>
                  </div>
                </section>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 h-10 flex items-center justify-between text-xs text-slate-400 bg-white border-t border-slate-100 shrink-0">
              <span>CASHFLOW v1.0</span>
            </div>
          </>
        )}
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
