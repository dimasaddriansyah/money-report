import DashboardLayout from "./DashboardLayout";
import DashboardSectionRecentTransactions from "./DashboardSectionRecentTransactions";
import DashboardSectionLayout from "./DashboardSectionLayout";
import DashboardSectionSummary from "./DashboardSectionSummary";
import DashboardSectionAccountBalanceSummary from "./DashboardSectionAccountBalanceSummary";
import DashboardSectionLayoutCategoryExpense from "./DashboardSectionLayoutCategoryExpense";
import DashboardComponentChartDailyExpense from "./DashboardComponentChartDailyExpense";
import DashboardComponentChartTopExpense from "./DashboardComponentChartTopExpense";
import { useDashboardData } from "../hooks/useDashboardData";

export default function DashboardDesktop() {
  const {
    loading,
    refetch,
    transactions,
    accounts,
    categories,
    summary,
    accountsWithBalance,
    dailyExpense,
    topExpenses,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <DashboardSectionSummary summary={summary} />

      <DashboardSectionAccountBalanceSummary accounts={accountsWithBalance} />

      <DashboardSectionLayout title="Daily Expense">
        <DashboardComponentChartDailyExpense data={dailyExpense} />
      </DashboardSectionLayout>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-7">
          <DashboardSectionLayout title="Top Expense">
            <DashboardComponentChartTopExpense data={topExpenses} />
          </DashboardSectionLayout>
        </div>
        <div className="col-span-5">
          <DashboardSectionLayout title="Category Expense">
            <DashboardSectionLayoutCategoryExpense transactions={transactions} categories={categories}/>
          </DashboardSectionLayout>
        </div>
      </div>

      <DashboardSectionLayout title="Recently Transactions" button={{ label: "View more", url: "/transactions" }}>
        <DashboardSectionRecentTransactions
          transactions={transactions}
          accounts={accounts}
          categories={categories}
          refetch={refetch} />
      </DashboardSectionLayout>

    </DashboardLayout >
  );
}