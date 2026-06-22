import DashboardLayout from "./DashboardLayout";
import DashboardSectionRecentTransactions from "./DashboardSectionRecentTransactions";
import DashboardSectionLayout from "./DashboardSectionLayout";
import DashboardSectionSummary from "./DashboardSectionSummary";
import DashboardSectionAccountBalanceSummary from "./DashboardSectionAccountBalanceSummary";
import DashboardSectionLayoutCategoryExpense from "./DashboardSectionLayoutCategoryExpense";
import DashboardComponentChartDailyExpense from "./DashboardComponentChartDailyExpense";
import DashboardComponentChartTopExpense from "./DashboardComponentChartTopExpense";
import { useDashboardData } from "../hooks/useDashboardData";
import type { Transaction } from "../../transactions/types/transaction";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import { useEffect, useRef, useState } from "react";
import { ArrowDown01Icon, Calendar03Icon, CreditCardIcon, Note05Icon, PlusSignIcon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";
import { getAccountsImg, getCategoriesImg } from "../../../shared/utils/style.helper";

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  refetch: () => void;
}

type Period = "year" | "month" | "week" | "yesterday" | "today";


export default function DashboardDesktop({ transactions, accounts, categories, refetch }: Props) {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("month");
  const [selectedMonth] = useState(new Date());

  const accountRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [openFilterAccount, setOpenFilterAccount] = useState(false);
  const [openFilterPeriod, setOpenFilterPeriod] = useState(false);
  const [openFilterCategory, setOpenFilterCategory] = useState(false);

  const selectedAccountData = accounts.find(
    (acc) => acc.id === selectedAccount
  );

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  const periods = [
    { label: "Year", value: "year" },
    { label: "Month", value: "month" },
    { label: "Week", value: "week" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Today", value: "today" }
  ];

  const filteredTransactions = transactions.filter((trx) => {
    const trxDate = new Date(trx.date);
    const now = new Date();

    let matchPeriod = false;

    switch (period) {
      case "year":
        matchPeriod =
          trxDate.getFullYear() === now.getFullYear();
        break;

      case "month": {
        const dayStart = 25;
        const dayEnd = 24;

        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();

        const endDate = new Date(year, month, dayEnd, 23, 59, 59);
        const startDate = new Date(year, month - 1, dayStart, 0, 0, 0);

        matchPeriod =
          trxDate >= startDate &&
          trxDate <= endDate;

        break;
      }

      case "week": {
        const day = now.getDay();
        const diff =
          now.getDate() -
          day +
          (day === 0 ? -6 : 1);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(now);
        endOfWeek.setHours(23, 59, 59, 999);

        matchPeriod =
          trxDate >= startOfWeek &&
          trxDate <= endOfWeek;

        break;
      }

      case "yesterday": {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        matchPeriod =
          trxDate.getFullYear() === yesterday.getFullYear() &&
          trxDate.getMonth() === yesterday.getMonth() &&
          trxDate.getDate() === yesterday.getDate();

        break;
      }

      case "today": {
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        matchPeriod =
          trxDate >= startOfDay &&
          trxDate <= endOfDay;

        break;
      }

      default:
        matchPeriod = true;
    }

    const matchAccount =
      !selectedAccount ||
      trx.fromAccountId === selectedAccount;

    const matchCategory =
      !selectedCategory ||
      trx.categoryId === selectedCategory;

    return matchPeriod && matchAccount && matchCategory;
  });

  const dashboardFiltered = useDashboardData({
    transactions: filteredTransactions,
    accounts,
    categories,
    refetch,
  });

  const dashboardAll = useDashboardData({
    transactions,
    accounts,
    categories,
    refetch,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (periodRef.current && !periodRef.current.contains(target)) {
        setOpenFilterPeriod(false);
      }
      if (accountRef.current && !accountRef.current.contains(target)) {
        setOpenFilterAccount(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setOpenFilterCategory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DashboardLayout>
      <DashboardSectionSummary summary={dashboardAll.summary} />

      <DashboardSectionAccountBalanceSummary accounts={dashboardAll.accountsWithBalance} autoScroll={true} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filter Period */}
        <div className="flex flex-col gap-1 flex-1 min-w-60">
          <span className="text-slate-500 text-xs">Period</span>
          <div ref={periodRef} className="relative">
            <button
              onClick={() => { setOpenFilterPeriod(prev => !prev) }}
              className="flex items-center justify-between w-full px-3 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer gap-4">
              <div className="flex items-center gap-3">
                <Calendar03Icon className="text-slate-400" size={16} />
                <span className={`text-sm ${periods ? "text-black" : "text-slate-400"}`}>
                  {periods.find((p) => p.value === period)?.label}
                </span>
              </div>
              <ArrowDown01Icon className="text-slate-400" size={16} />
            </button>
            {openFilterPeriod && (
              <div className="absolute z-10 mt-2 w-60 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {periods.map((item) => {
                  const isSelected = period === item.value;
                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        setPeriod(item.value as Period);
                        setOpenFilterPeriod(false);
                      }}
                      className={`px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                        ${isSelected
                          ? "bg-slate-100 font-medium"
                          : "text-slate-400 hover:bg-slate-50"}`}>
                      {item.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Filter Accounts */}
        <div className="flex flex-col gap-1 flex-1 min-w-60">
          <span className="text-slate-500 text-xs">Accounts</span>
          <div ref={accountRef} className="relative">
            <button
              onClick={() => { setOpenFilterAccount(prev => !prev) }}
              className="flex items-center justify-between w-full px-3 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer gap-4">
              <div className="flex items-center gap-3">
                <CreditCardIcon className="text-slate-400" size={16} />
                <span className={`text-sm ${selectedAccountData ? "text-black" : "text-slate-400"}`}>
                  {selectedAccountData?.name || "All Accounts"}
                </span>
              </div>
              <ArrowDown01Icon className="text-slate-400" size={16} />
            </button>
            {openFilterAccount && (
              <div className="absolute z-10 mt-2 w-60 h-60 bg-white border border-slate-200 rounded-lg shadow-sm overflow-y-auto">
                <div
                  onClick={() => {
                    setSelectedAccount(null)
                    setOpenFilterAccount(false)
                  }}
                  className={`px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                    ${!selectedAccount ? "bg-slate-100 font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                  <span>All Accounts</span>
                </div>
                {accounts.map((acc) => {
                  const isSelected = selectedAccount === acc.id;
                  return (
                    <div
                      key={acc.id}
                      onClick={() => {
                        setSelectedAccount(acc.id)
                        setOpenFilterAccount(false)
                      }}
                      className={`flex items-center gap-4 px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                          ${isSelected ? "bg-slate-100 font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                      <img src={getAccountsImg(acc.name)} className="w-6 h-6" />
                      <span>{acc.name}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        {/* Filter Categories */}
        <div className="flex flex-col gap-1 flex-1 min-w-60">
          <span className="text-slate-500 text-xs">Categories</span>
          <div ref={categoryRef} className="relative">
            <button
              onClick={() => { setOpenFilterCategory(prev => !prev) }}
              className="flex items-center justify-between w-full px-3 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer gap-4">
              <div className="flex items-center gap-3">
                <Note05Icon className="text-slate-400" size={16} />
                <span className={`text-sm ${selectedCategoryData ? "text-black" : "text-slate-400"}`}>
                  {selectedCategoryData?.name || "All Categories"}
                </span>
              </div>
              <ArrowDown01Icon className="text-slate-400" size={16} />
            </button>
            {openFilterCategory && (
              <div className="absolute z-10 mt-2 w-60 h-60 bg-white border border-slate-200 rounded-lg shadow-sm overflow-y-auto">
                <div
                  onClick={() => {
                    setSelectedCategory(null)
                    setOpenFilterCategory(false)
                  }}
                  className={`px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                    ${!selectedCategory ? "bg-slate-100 font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                  <span>All Categories</span>
                </div>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id)
                        setOpenFilterCategory(false)
                      }}
                      className={`flex items-center gap-4 px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                          ${isSelected ? "bg-slate-100 font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                      <img src={getCategoriesImg(cat.name)} className="w-6 h-6" />
                      <span>{cat.name}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate('/transaction/create')}
          className="self-end flex items-center px-5 py-2.5 gap-2 bg-black hover:bg-slate-900 text-white text-sm font-medium rounded-lg cursor-pointer">
          <PlusSignIcon size={16} />
          <span>Create Transaction</span>
        </button>
      </div>

      <DashboardSectionLayout title="Daily Expense">
        <DashboardComponentChartDailyExpense data={dashboardFiltered.dailyExpense} />
      </DashboardSectionLayout>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-12 lg:col-span-8">
          <DashboardSectionLayout title="Top Expense">
            <DashboardComponentChartTopExpense data={dashboardFiltered.topExpenses} />
          </DashboardSectionLayout>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <DashboardSectionLayout title="Category Expense">
            <DashboardSectionLayoutCategoryExpense transactions={filteredTransactions} categories={categories} />
          </DashboardSectionLayout>
        </div>
      </div>

      <DashboardSectionLayout title="Recently Transactions" button={{ label: "View more", url: "/transactions" }}>
        <DashboardSectionRecentTransactions
          transactions={filteredTransactions}
          accounts={accounts}
          categories={categories}
          refetch={refetch} />
      </DashboardSectionLayout>
    </DashboardLayout >
  );
}