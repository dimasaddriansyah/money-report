import { useEffect, useMemo, useRef, useState } from "react";
import AccountBalances from "../components/dashboards/AccountBalances";
import CurrentBalance from "../components/dashboards/CurrentBalance";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import TransactionGroup from "../components/dashboards/TransactionGroup";
import DesktopLayout from "../components/utils/DesktopLayout";
import EmptyState from "../components/utils/EmptyState";
import MobileLayout from "../components/utils/MobileLayout";
import { useLocalStorage } from "../hooks/utils/useLocalStorage";
import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import { formatRupiah, formatRupiahInput, MONTHS, smartCapitalize } from "../helpers/Format";
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
import { useAccounts } from "../hooks/accounts/useAccounts";

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

  const [openModal, setOpenModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOpenModal(false);
    }, 300);
  }

  const { accounts, loading: loadingAccounts } = useAccounts();
  // Form
  const [isActiveDate, setIsActiveDate] = useState(false);
  const [type, setType] = useState<"income" | "expenses" | "transfer">("expenses");
  const [openAccount, setOpenAccount] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [date, setDate] = useState("");
  const [rawNominal, setRawNominal] = useState("");
  const formattedNominal = formatRupiahInput(rawNominal);

  const dateRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const [formAccount, setFormAccount] = useState({
    from_account: "",
    to_account: "",
  });
  const [remark, setRemark] = useState("");

  const getAccountField = (): "from_account" | "to_account" => {
    if (type === "expenses") return "from_account";
    if (type === "income") return "to_account";
    return "from_account";
  };

  const [activeAccountField, setActiveAccountField] = useState<
    "from_account" | "to_account"
  >("from_account");

  const accountValue =
    type === "expenses"
      ? formAccount.from_account
      : formAccount.to_account;

  const handleSelectAccount = (
    acc: string,
    field: "from_account" | "to_account"
  ) => {
    console.log("SELECTED:", acc, field);

    setFormAccount((prev) => {
      const updated = {
        ...prev,
        [field]: acc,
      };

      console.log("UPDATED FORM:", updated);
      return updated;
    });

    setOpenAccount(false);
  };

  const handleChangeNominal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");
    setRawNominal(numeric);
  };

  const formatDisplayDate = (value?: string) => {
    if (!value) return "Select date";
    const d = new Date(value);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const openDatePicker = () => {
    setIsActiveDate(true);
    dateRef.current?.showPicker();
  };

  useEffect(() => {
    if (!date) {
      setDate(new Date().toISOString().split("T")[0]);
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("#account")) {
        setOpenAccount(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, []);


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
                    <EmptyState icon={<InvoiceIcon />} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow." />
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
                    <EmptyState icon={<InvoiceIcon />} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow." />
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
                    <EmptyState icon={<InvoiceIcon />} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow." />
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
            <EmptyState icon={<InvoiceIcon />} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow." />
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
            <div className="flex border rounded-xl overflow-hidden">
              {["income", "expenses", "transfer"].map((item) => (
                <button
                  key={item}
                  onClick={() => setType(item as any)}
                  className={`px-6 py-2 text-sm ${type === item ? "bg-slate-900 text-white" : "text-slate-400"
                    }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div id="date" className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-1">Date</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none">
                    <Calendar01Icon className="text-slate-400" size={20} />
                  </div>
                  <span
                    onClick={openDatePicker}
                    className={`block w-full ps-13 pe-10 py-2.5 text-base rounded-xl border cursor-pointer transition-all duration-200
                      ${date ? "text-gray-900" : "text-slate-400"}
                      ${isActiveDate
                        ? "ring-1 ring-slate-900"
                        : "border-gray-200 hover:border-gray-300"}
                    `}
                  >
                    {formatDisplayDate(date)}
                  </span>
                  <input
                    ref={dateRef}
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setIsActiveDate(false);
                    }}
                    className="absolute inset-0 opacity-0 pointer-events-none"
                  />
                  <ArrowDown01Icon className="absolute right-4 text-slate-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div id="nominal" className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Nominal
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none">
                    <DollarCircleIcon className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="text"
                    value={formattedNominal}
                    onChange={handleChangeNominal}
                    placeholder="Input nominal"
                    className="block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                  />
                </div>
              </div>
            </div>
            {type !== "transfer" && (
              <div className="flex gap-3">
                <div id="account" className="relative w-full flex-1" ref={accountRef}>
                  <label className="text-sm font-medium">Account</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none">
                      <CreditCardIcon className="text-slate-400" size={20} />
                    </div>
                    <div
                      onClick={() => {
                        setActiveAccountField(getAccountField());
                        setOpenAccount(true);
                        setOpenCategory(false);
                      }}
                      className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border border-gray-200 hover:border-gray-300 transition cursor-pointer
                        ${accountValue ? "text-gray-900" : "text-slate-400"}
                      `}
                    >
                      {accountValue || "Select account"}
                    </div>
                    <ArrowDown01Icon className="absolute right-4 text-slate-400 pointer-events-none" size={20} />
                  </div>
                  {openAccount && (
                    <div className="absolute mt-2 w-full bg-white border rounded-xl shadow max-h-60 overflow-y-auto">
                      {loadingAccounts ? (
                        <div className="p-3 text-sm text-slate-400">Loading...</div>
                      ) : accounts.length === 0 ? (
                        <div className="p-3 text-sm text-slate-400">No accounts</div>
                      ) : (
                        accounts.map((acc) => (
                          <div
                            key={acc.account_id}
                            onClick={() => {
                              handleSelectAccount(acc.name, getAccountField());
                            }}
                            className="flex items-center gap-4 px-4 py-2 hover:bg-slate-100 cursor-pointer"
                          >
                            <img
                              src={getAccountsImg(acc.name)}
                              className="w-6 h-6"
                            />
                            <span>{acc.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <div id="category" className="flex-1">
                  <label className="block text-sm font-medium text-gray-900 mb-1">Category</label>
                  <div className="relative flex items-center justify-center">
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
            )}
            {type === "transfer" && (
              <div className="flex gap-3">
                {/* FROM ACCOUNT*/}
                <div id="from_account" className="flex-1">
                  <label className="text-sm font-medium">From Account</label>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute left-4 pointer-events-none">
                      <LicenseIcon className="text-slate-400" size={20} />
                    </div>
                    <div
                      onClick={() => {
                        setActiveAccountField(getAccountField());
                        setOpenAccount(true);
                      }}
                      className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border transition cursor-pointer
                        ${accountValue ? "text-gray-900" : "text-slate-400"}
                        border-gray-200 hover:border-gray-300
                      `}
                    >
                      {accountValue || "Select account"}
                    </div>
                    <ArrowDown01Icon className="absolute right-4 text-slate-400 pointer-events-none" size={20} />
                  </div>
                </div>
                {/* TO ACCOUNT*/}
                <div id="to_account" className="flex-1">
                  <label className="text-sm font-medium">To Account</label>
                  <div
                    onClick={() => {
                      setActiveAccountField("to_account");
                      setOpenAccount(true);
                    }}
                    className="border rounded-xl px-3 py-2.5 cursor-pointer"
                  >
                    {formAccount.to_account || "Select account"}
                  </div>
                </div>
              </div>
            )}
            <div id="remark" className="mt-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Remark {type === "transfer" && (
                  <span className="text-slate-400">(optional)</span>
                )}</label>
              <textarea
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
