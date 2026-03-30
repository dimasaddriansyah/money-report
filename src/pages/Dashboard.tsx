import { useMemo, useState } from "react";
import AccountBalances from "../components/dashboards/AccountBalances";
import CurrentBalance from "../components/dashboards/CurrentBalance";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import TransactionGroup from "../components/dashboards/TransactionGroup";
import DesktopLayout from "../components/utils/DesktopLayout";
import EmptyState from "../components/utils/EmptyState";
import MobileLayout from "../components/utils/MobileLayout";
import { useLocalStorage } from "../hooks/utils/useLocalStorage";
import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import { formatRupiah, MONTHS, smartCapitalize } from "../helpers/Format";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useGroupedTransactions } from "../hooks/transactions/useGroupedTransactions";
import {
  ArrowDown01Icon,
  ViewIcon,
  Menu01Icon,
  Money01Icon,
  Notification01Icon,
  PlusSignIcon,
  Search01Icon,
  ViewOffSlashIcon,
  MoneySend02Icon,
  MoneyReceive02Icon,
  Invoice01Icon,
  UserIcon,
  NoteEditIcon,
  Delete02Icon,
} from "hugeicons-react";
import ExpensesChart from "../components/insights/ExpensesChart";
import TopExpensesChart from "../components/insights/TopExpensesChart";
import CategoryExpensesSection from "../components/insights/CategoryExpensesSection";

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

  const expenseTransactions = useMemo(() => {
    return flatTransactions.filter((trx) => trx.type === "expenses");
  }, [flatTransactions]);

  const COLORS = ["#5070DD", "#B6D634", "#FF994D", "#0CA8DF", "#505372"];

  // 🔥 PIE DATA
  const pieData = useMemo(() => {
    const grouped: Record<string, number> = {};

    expenseTransactions.forEach((trx) => {
      const category = trx.category;

      if (!grouped[category]) grouped[category] = 0;

      grouped[category] += Number(trx.nominal);
    });

    const sorted = Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const top4 = sorted.slice(0, 4);
    const rest = sorted.slice(4);

    const othersValue = rest.reduce((sum, item) => sum + item.value, 0);

    if (othersValue > 0) {
      top4.push({
        name: "Others",
        value: othersValue,
      });
    }

    return top4;
  }, [expenseTransactions]);

  const categorySummary = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};

    expenseTransactions.forEach((trx) => {
      const category = trx.category;

      if (!grouped[category]) {
        grouped[category] = {
          total: 0,
          count: 0,
        };
      }

      grouped[category].total += Number(trx.nominal);
      grouped[category].count += 1;
    });

    return Object.entries(grouped)
      .map(([name, data]) => ({
        name,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenseTransactions]);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories
    ? categorySummary
    : categorySummary.slice(0, 4);

  const [activeRange, setActiveRange] = useState("ALL_TIME");
  const ranges = [
    { label: "All Time", value: "ALL_TIME" },
    { label: "1 Year", value: "1_YEAR" },
    { label: "1 Month", value: "1_MONTH" },
    { label: "1 Week", value: "1_WEEK" },
    { label: "Yesterday", value: "YESTERDAY" },
  ];

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
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-6">
                  {hideBalance ?
                    <ViewIcon
                      onClick={() => setHideBalance(false)}
                      className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer"
                      strokeWidth={2} />
                    : <ViewOffSlashIcon
                      onClick={() => setHideBalance(true)}
                      className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer"
                      strokeWidth={2} />
                  }
                  <Search01Icon className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer" />
                  <Notification01Icon className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer" />
                </div>
                <div className="w-px h-8 bg-neutral-100"></div>
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="relative w-fit">
                    <div className="bg-slate-50/40 p-2 rounded-xl">
                      <UserIcon className="text-slate-900" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-1 border-white rounded-full"></span>
                  </div>
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
              {/* ROW 1 */}
              <div className="flex justify-between gap-6">
                <div className="flex items-center bg-white border border-slate-100 text-sm rounded-xl overflow-hidden">
                  {ranges.map((item) => {
                    const isActive = activeRange === item.value;
                    return (
                      <span
                        key={item.value}
                        onClick={() => setActiveRange(item.value)}
                        className={`flex px-3 h-full items-center cursor-pointer transition-all
                          ${isActive
                            ? "bg-slate-900 text-white font-semibold"
                            : "text-slate-400 hover:bg-slate-100"
                          }`}
                      >
                        {item.label}
                      </span>
                    );
                  })}
                </div>

                <button className="flex items-center px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl gap-2 cursor-pointer">
                  <PlusSignIcon className="w-5 h-5 text-white" />
                  <span>Add Transaction</span>
                </button>
              </div>

              {/* ROW 2 */}
              <div className="flex justify-between gap-6">
                <section className="flex-1 bg-white rounded-2xl p-6 space-y-4">
                  <div className="bg-blue-50 w-fit p-2 rounded-xl">
                    <Money01Icon className="text-blue-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">{hideBalance ? "Rp ••••••" : formatRupiah(25000)}</h1>
                    <span className="text-sm text-slate-400">Total Balance</span>
                  </div>
                </section>
                <section className="flex-1 bg-white rounded-2xl p-6 space-y-4">
                  <div className="bg-green-50 w-fit p-2 rounded-xl">
                    <MoneyReceive02Icon className="text-green-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">{hideBalance ? "Rp ••••••" : formatRupiah(25000)}</h1>
                    <span className="text-sm text-slate-400">Total Income</span>
                  </div>
                </section>
                <section className="flex-1 bg-white rounded-2xl p-6 space-y-4">
                  <div className="bg-red-50 w-fit p-2 rounded-xl">
                    <MoneySend02Icon className="text-red-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">{hideBalance ? "Rp ••••••" : formatRupiah(25000)}</h1>
                    <span className="text-sm text-slate-400">Total Expenses</span>
                  </div>
                </section>
                <section className="flex-1 bg-white rounded-2xl p-6 space-y-4">
                  <div className="bg-slate-50 w-fit p-2 rounded-xl">
                    <Invoice01Icon className="text-slate-900" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">200</h1>
                    <span className="text-sm text-slate-400">Total Transactions</span>
                  </div>
                </section>
              </div>

              {/* ROW 3 */}
              <div className="flex justify-between gap-6">
                <section className="flex-1 bg-white rounded-2xl p-6">
                  <span className="text-base font-medium">Daily Expenses</span>
                  <div className="h-px bg-slate-100/60 my-3" />
                  {isEmpty ? (
                    <EmptyState />
                  ) : (
                    <ExpensesChart transactions={expenseTransactions} />
                  )}
                </section>
              </div>

              {/* ROW 4 */}
              <div className="flex justify-between gap-6">
                <section className="flex-1 bg-white rounded-2xl p-6">
                  <span className="text-base font-medium">Top Expenses</span>
                  <div className="h-px bg-slate-100/60 my-3" />
                  {isEmpty ? (
                    <EmptyState />
                  ) : (
                    <TopExpensesChart transactions={expenseTransactions} data={10} labelLength={20} />
                  )}
                </section>
                <CategoryExpensesSection
                  isEmpty={isEmpty}
                  pieData={pieData}
                  COLORS={COLORS}
                  visibleCategories={visibleCategories}
                  categorySummary={categorySummary}
                  showAllCategories={showAllCategories}
                  setShowAllCategories={setShowAllCategories}
                  formatRupiah={formatRupiah}
                />
              </div>

              {/* ROW 5 */}
              <div className="flex justify-between gap-6">
                <section className="flex-1 bg-white rounded-2xl p-6">
                  <span className="text-base font-medium">Recently Transaction</span>
                  <div className="h-px bg-slate-100/60 my-3" />
                  {isEmpty ? (
                    <EmptyState />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500 border-b border-slate-100">
                            <th className="py-2">Date</th>
                            <th className="py-2">Remark</th>
                            <th className="py-2">Category</th>
                            <th className="py-2 text-right">Amount</th>
                            <th className="py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions
                            .slice()
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 10).map((trx) => (
                              <tr
                                key={trx.transaction_id}
                                className="border-b border-slate-50 hover:bg-slate-50 transition"
                              >
                                <td className="py-3">
                                  {trx.date || "-"}
                                </td>
                                <td className="py-3">
                                  <div className="flex flex-col">
                                    <span className={`${trx.type === "expenses" ? "text-red-500" : trx.type === "income" ? "text-green-500" : "text-slate-500"} font-medium`}>{smartCapitalize(trx.type) || "-"}</span>
                                    <span className="text-slate-500">{trx.remark || "-"}</span>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <div className="flex flex-col">
                                    <span className="text-slate-900 font-medium">{trx.to_account || "-"}</span>
                                    <span className="text-slate-500">{trx.category || "-"}</span>
                                  </div>
                                </td>
                                <td className="py-3 text-right font-semibold">
                                  {formatRupiah(trx.nominal)}
                                </td>
                                <td className="py-3 pl-2">
                                  <div className="flex justify-center gap-2">
                                    <div className="bg-amber-50 hover:bg-amber-200 p-2 rounded-xl cursor-pointer">
                                      <NoteEditIcon className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="bg-red-50 hover:bg-red-200 p-2 rounded-xl cursor-pointer">
                                      <Delete02Icon className="w-5 h-5 text-red-500" />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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
          className={`bg-white rounded-t-3xl overflow-hidden flex flex-col ${isEmpty ? "flex-1 min-h-dvh" : "pb-24"
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
