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
  Money01Icon,
  PlusSignIcon,
  MoneySend02Icon,
  MoneyReceive02Icon,
  Invoice01Icon,
  NoteEditIcon,
  Delete02Icon,
  LicenseIcon,
  CreditCardIcon,
  DollarCircleIcon,
  Calendar01Icon,
  InvoiceIcon,
} from "hugeicons-react";
import ExpensesChart from "../components/insights/ExpensesChart";
import TopExpensesChart from "../components/insights/TopExpensesChart";
import CategoryExpensesSection from "../components/insights/CategoryExpensesSection";
import Modal from "../components/utils/Modal";
import { getAccountsImg, getCategoriesImg } from "../helpers/UI";
import FooterDesktop from "../components/utils/FooterDesktop";
import HeaderDesktop from "../components/utils/HeaderDesktop";

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

  const totalIncome = useMemo(() => {
    return flatTransactions
      .filter((trx) => trx.type === "income")
      .reduce((sum, trx) => sum + Number(trx.nominal), 0);
  }, [flatTransactions]);

  const totalExpenses = useMemo(() => {
    return flatTransactions
      .filter((trx) => trx.type === "expenses")
      .reduce((sum, trx) => sum + Number(trx.nominal), 0);
  }, [flatTransactions]);

  const totalTransactions = flatTransactions.length;

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

  const [type, setType] = useState<"income" | "expenses" | "transfer">("expenses");

  const [openModal, setOpenModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOpenModal(false);
    }, 300);
  }

  return (
    <div>
      {/* DESKTOP */}
      <DesktopLayout>
        {/* HEADER */}
        {({ collapsed, setCollapsed }: any) => (
          <>
            {/* HEADER */}
            <HeaderDesktop
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              hideBalance={hideBalance}
              setHideBalance={setHideBalance}
              showBalanceToggle={true}
            />

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

                <button
                  onClick={() => setOpenModal(true)}
                  className="flex items-center p-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl gap-2 cursor-pointer">
                  <PlusSignIcon className="text-white" size={20} />
                  <span>Add Transaction</span>
                </button>
              </div>

              {/* ROW 2 */}
              <div className="flex gap-6">
                <section className="flex-1 bg-white rounded-2xl p-6 space-y-4">
                  <div className="bg-blue-50 w-fit p-2 rounded-xl">
                    <Money01Icon className="text-blue-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">{hideBalance ? "Rp ••••••" : formatRupiah(currentBalance)}</h1>
                    <span className="text-sm text-slate-400">Total Balance</span>
                  </div>
                </section>
                <section className="flex-1 bg-white rounded-2xl p-6 space-y-4">
                  <div className="bg-green-50 w-fit p-2 rounded-xl">
                    <MoneyReceive02Icon className="text-green-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">{hideBalance ? "Rp ••••••" : formatRupiah(totalIncome)}</h1>
                    <span className="text-sm text-slate-400">Total Income</span>
                  </div>
                </section>
                <section className="flex-1 bg-white rounded-2xl p-6 space-y-4">
                  <div className="bg-red-50 w-fit p-2 rounded-xl">
                    <MoneySend02Icon className="text-red-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">{hideBalance ? "Rp ••••••" : formatRupiah(totalExpenses)}</h1>
                    <span className="text-sm text-slate-400">Total Expenses</span>
                  </div>
                </section>
                <section className="flex-1 bg-white rounded-2xl p-6 space-y-4">
                  <div className="bg-slate-50 w-fit p-2 rounded-xl">
                    <Invoice01Icon className="text-slate-900" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">{totalTransactions}</h1>
                    <span className="text-sm text-slate-400">Total Transactions</span>
                  </div>
                </section>
              </div>

              {/* ROW 3 */}
              <div className="flex gap-6 min-w-0">
                <section className="flex-1 bg-white rounded-2xl p-6">
                  <span className="text-base font-semibold">Daily Expenses</span>
                  <div className="h-px bg-slate-100/60 my-3" />
                  {isEmpty ? (
                    <EmptyState icon={<InvoiceIcon/>} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow."  />
                  ) : (
                    <ExpensesChart transactions={expenseTransactions} hideBalance={hideBalance} />
                  )}
                </section>
              </div>

              {/* ROW 4 */}
              <div className="flex gap-6">
                <section className="flex-7 bg-white rounded-2xl p-6">
                  <span className="text-base font-semibold">Top Expenses</span>
                  <div className="h-px bg-slate-100/60 my-3" />
                  {isEmpty ? (
                    <EmptyState icon={<InvoiceIcon/>} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow."  />
                  ) : (
                    <TopExpensesChart
                      transactions={expenseTransactions}
                      data={10}
                      labelLength={20}
                      hideBalance={hideBalance} />
                  )}
                </section>
                <section className="flex-3">
                  <CategoryExpensesSection
                    isEmpty={isEmpty}
                    pieData={pieData}
                    COLORS={COLORS}
                    visibleCategories={visibleCategories}
                    categorySummary={categorySummary}
                    showAllCategories={showAllCategories}
                    setShowAllCategories={setShowAllCategories}
                    formatRupiah={formatRupiah}
                    hideBalance={hideBalance}
                  />
                </section>
              </div>

              {/* ROW 5 */}
              <div className="flex gap-6">
                <section className="flex-1 bg-white rounded-2xl p-6">
                  <span className="text-base font-semibold">Recently Transaction</span>
                  <div className="h-px bg-slate-100/60 mt-3" />
                  {isEmpty ? (
                    <EmptyState icon={<InvoiceIcon/>} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow."  />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
                        <thead className="bg-slate-50">
                          <tr className="text-left text-slate-500 border-b border-slate-100">
                            <th>#</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Account</th>
                            <th>Category</th>
                            <th className="text-right">Amount</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions
                            .slice()
                            .sort((a, b) => b.transaction_id.localeCompare(a.transaction_id))
                            .slice(0, 10)
                            .map((row, index) => (
                              <tr
                                key={row.transaction_id}
                                className="border-b border-slate-50 hover:bg-slate-50 transition"
                              >
                                <td className="w-12 text-slate-500 font-medium">{index + 1}</td>
                                <td className="py-3 text-slate-500">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-slate-900">{row.day || "-"}</span>
                                    <span className="text-slate-500">{row.date || "-"} </span>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <div className="flex flex-col">
                                    <span className={`w-fit px-2 py-1 text-xs font-medium rounded-full
                                      ${row.type === "expenses" ? "bg-red-50 text-red-500"
                                        : row.type === "income" ? "bg-green-50 text-green-500"
                                          : "bg-slate-50 text-slate-500"}`}>
                                      {smartCapitalize(row.type) || "-"}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <div className="flex flex-col">
                                    {(() => {
                                      const account =
                                        row.type === "expenses"
                                          ? row.from_account
                                          : row.type === "income"
                                            ? row.to_account
                                            : row.from_account;

                                      return (
                                        <span className="flex items-center gap-3 text-slate-900 font-medium">
                                          <img
                                            src={getAccountsImg(account)}
                                            alt={account}
                                            className="w-8 h-8"
                                          />
                                          {account}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={getCategoriesImg(row.category)}
                                      alt={row.category}
                                      className="w-8 h-8"
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-slate-900 font-medium">{row.category || "-"}</span>
                                      <span className="text-slate-500">{row.remark || "-"}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className={`py-3 text-right font-semibold
                                  ${row.type === "expenses" ? "text-red-500"
                                    : row.type === "income" ? "text-green-500"
                                      : "text-slate-500"}`}>
                                  {hideBalance ? "Rp ••••••" : formatRupiah(row.nominal)}
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
            <FooterDesktop />
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
            <EmptyState icon={<InvoiceIcon/>} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow."  />
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

      {/* MODAL */}
      {openModal && (
        <Modal
          size="large"
          title="Add Transaction"
          textButton="Create Transaction"
          loading={Loading}
          onSubmit={handleSubmit}
          onClose={() => setOpenModal(false)}
        >
          <div className="flex flex-col gap-3">
            <div className="flex w-fit border border-slate-200 rounded-xl overflow-hidden">
              {[
                { key: "income", label: "Income", active: "bg-green-50 text-green-500 font-medium" },
                { key: "expenses", label: "Expenses", active: "bg-red-50 text-red-500 font-medium" },
                { key: "transfer", label: "Transfer", active: "bg-blue-50 text-blue-500 font-medium" },
              ].map((item) => {
                const isActive = type === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => setType(item.key as any)}
                    className={`px-6 py-2.5 text-sm transition cursor-pointer
                      ${isActive
                        ? item.active
                        : "text-slate-400 hover:bg-slate-50"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <div id="date" className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Date
                </label>
                <div
                  // onClick={() => setOpenCategorySheet(true)}
                  className="relative flex items-center justify-center"
                >
                  <div className="absolute left-4 pointer-events-none">
                    <Calendar01Icon className="text-slate-400" size={20} />
                  </div>
                  <span
                    className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border text-slate-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
                  >
                    Select date
                  </span>
                  <ArrowDown01Icon className="absolute right-4 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div id="nominal" className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Nominal
                </label>
                <div
                  // onClick={() => setOpenCategorySheet(true)}
                  className="relative flex items-center justify-center"
                >
                  <div className="absolute left-4 pointer-events-none">
                    <DollarCircleIcon className="text-slate-400" size={20} />
                  </div>
                  <span
                    className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border text-slate-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none`}
                  >
                    Input nominal
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div id="account" className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Account
                </label>
                <div
                  // onClick={() => setOpenCategorySheet(true)}
                  className="relative flex items-center justify-center"
                >
                  <div className="absolute left-4 pointer-events-none">
                    <CreditCardIcon className="text-slate-400" size={20} />
                  </div>
                  <span
                    className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border text-slate-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
                  >
                    Select account
                  </span>
                  <ArrowDown01Icon className="absolute right-4 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div id="category" className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Category
                </label>
                <div
                  // onClick={() => setOpenCategorySheet(true)}
                  className="relative flex items-center justify-center"
                >
                  <div className="absolute left-4 pointer-events-none">
                    <LicenseIcon className="text-slate-400" size={20} />
                  </div>
                  <span
                    className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border text-slate-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
                  >
                    Select category
                  </span>
                  <ArrowDown01Icon className="absolute right-4 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
            </div>
            <div id="remark">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Remark
              </label>
              <textarea
                className="w-full rounded-xl border border-gray-200 p-3"
                rows={3}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
