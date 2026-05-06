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
import { useState } from "react";
import { PlusSignIcon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";

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
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);
  const {
    summary,
    accountsWithBalance,
    dailyExpense,
    topExpenses,
  } = useDashboardData({
    transactions: filteredTransactions,
    accounts,
    categories,
    refetch,
  });

  function filterTransactionsByPeriod(transactions: Transaction[], period: Period) {
    const now = new Date();

    return transactions.filter((trx) => {
      const trxDate = new Date(trx.date);

      switch (period) {
        case "year":
          return trxDate.getFullYear() === now.getFullYear();

        case "month": {
          const dayStart = 25; // bisa kamu ubah (misal dari setting)
          const dayEnd = 24;

          const year = selectedMonth.getFullYear();
          const month = selectedMonth.getMonth();

          // end = 24 di bulan selected
          const endDate = new Date(year, month, dayEnd, 23, 59, 59);

          // start = 25 di bulan sebelumnya
          const startDate = new Date(year, month - 1, dayStart, 0, 0, 0);

          return trxDate >= startDate && trxDate <= endDate;
        }

        case "week": {
          const day = now.getDay();
          const diff = now.getDate() - day + (day === 0 ? -6 : 1);
          const firstDayOfWeek = new Date(now);
          firstDayOfWeek.setDate(diff);

          return trxDate >= firstDayOfWeek && trxDate <= now;
        }

        case "yesterday": {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);

          return (
            trxDate.getFullYear() === yesterday.getFullYear() &&
            trxDate.getMonth() === yesterday.getMonth() &&
            trxDate.getDate() === yesterday.getDate()
          );
        }

        case "today": {
          const startOfDay = new Date(now);
          startOfDay.setHours(0, 0, 0, 0);

          const endOfDay = new Date(now);
          endOfDay.setHours(23, 59, 59, 999);

          return trxDate >= startOfDay && trxDate <= endOfDay;
        }

        default:
          return true;
      }
    });
  }

  return (
    <DashboardLayout>
      <section className="flex items-center justify-between">
        <section className="flex w-fit p-1 bg-slate-100 border border-slate-200 rounded-lg">
          {[
            { label: "Year", value: "year" },
            { label: "Month", value: "month" },
            { label: "Week", value: "week" },
            { label: "Yesterday", value: "yesterday" },
            { label: "Today", value: "today" }
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setPeriod(item.value as Period)}
              className={`px-4 py-2 text-sm transition cursor-pointer rounded-md
                ${period === item.value
                  ? "bg-white text-black font-semibold border border-slate-200"
                  : "text-slate-400 hover:bg-slate-200"}`}>
              {item.label}
            </button>))}
        </section>
        <button
          onClick={() => navigate('/transaction/create')}
          className="flex items-center px-5 py-2.5 gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg cursor-pointer">
          <PlusSignIcon size={16} />
          <span>Create Transaction</span>
        </button>
      </section>


      <DashboardSectionSummary summary={summary} />

      <DashboardSectionAccountBalanceSummary accounts={accountsWithBalance} autoScroll={true} />

      <DashboardSectionLayout title="Daily Expense">
        <DashboardComponentChartDailyExpense data={dailyExpense} />
      </DashboardSectionLayout>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-8">
          <DashboardSectionLayout title="Top Expense">
            <DashboardComponentChartTopExpense data={topExpenses} />
          </DashboardSectionLayout>
        </div>
        <div className="col-span-4">
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