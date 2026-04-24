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

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  refetch: () => void;
}

export default function DashboardDesktop({ transactions, accounts, categories, refetch }: Props) {
  const {
    summary,
    accountsWithBalance,
    dailyExpense,
    topExpenses,
  } = useDashboardData({
    transactions,
    accounts,
    categories,
    refetch,
  });

  return (
    <DashboardLayout>
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
            <DashboardSectionLayoutCategoryExpense transactions={transactions} categories={categories} />
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