import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import DashboardLayout from "./DashboardLayout";
import DashboardSectionRecentTransactions from "./DashboardSectionRecentTransactions";
import DashboardSectionLayout from "./DashboardSectionLayout";
import DashboardSectionSummary from "./DashboardSectionSummary";
import DashboardSectionAccountBalanceSummary from "./DashboardSectionAccountBalanceSummary";
import DashboardComponentDailyExpense from "./DashboardComponentDailyExpense";
import DashboardComponentTopExpense from "./DashboardComponentTopExpense";
import DashboardComponentCategoryExpense from "./DashboardComponentCategoryExpense";
import { useMemo } from "react";
import { formatDateDayMonth } from "../../../shared/utils/format.helper";

export default function DashboardDesktop() {
  const { transactions, loading, refetch } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  // SUMMARY
  const summary = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);

  // ACCOUNT BALANCES
  const accountBalances = useMemo(() => {
    const result: Record<string, number> = {};
    transactions.forEach((t) => {
      // INCOME
      if (t.type === "income" && t.toAccountId) {
        result[t.toAccountId] = (result[t.toAccountId] || 0) + t.amount;
      }
      // EXPENSE
      if (t.type === "expense" && t.fromAccountId) {
        result[t.fromAccountId] = (result[t.fromAccountId] || 0) - t.amount;
      }
      // TRANSFER
      if (t.type === "transfer") {
        if (t.fromAccountId) {
          result[t.fromAccountId] = (result[t.fromAccountId] || 0) - t.amount;
        }
        if (t.toAccountId) {
          result[t.toAccountId] = (result[t.toAccountId] || 0) + t.amount;
        }
      }
    });
    return result;
  }, [transactions]);

  const accountsWithBalance = useMemo(() => {
    return accounts
      .map(acc => ({
        ...acc,
        balance: accountBalances[acc.id] ?? 0,
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [accounts, accountBalances]);

  // DAILY EXPENSES CHART
  const dailyExpense = useMemo(() => {
    const result: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      const date = new Date(t.date).toISOString().split("T")[0];
      result[date] = (result[date] || 0) + t.amount;
    });

    return result;
  }, [transactions]);

  const chartDataDailyExpenses = useMemo(() => {
    const entries = Object.entries(dailyExpense)
      .sort(([a], [b]) => a.localeCompare(b));

    return {
      dates: entries.map(([date]) => formatDateDayMonth(date)),
      amounts: entries.map(([, amount]) => amount),
    };
  }, [dailyExpense]);

  // TOP EXPENSES CHART
  const chartDataTopExpenses = useMemo(() => {
    const top10 = transactions
      .filter(t => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .reverse();

    return {
      remarks: top10.map(t => t.remark ?? "-"),
      amounts: top10.map(t => t.amount),
    };
  }, [transactions]);

  // CATEGORY EXPENSES CHART
  const categoryExpense = useMemo(() => {
    const result: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      if (!t.categoryId) return;

      result[t.categoryId] = (result[t.categoryId] || 0) + t.amount;
    });

    return result;
  }, [transactions]);

  const chartDataCategoryExpenses = useMemo(() => {
    const entries = Object.entries(categoryExpense)
      .sort(([, a], [, b]) => b - a);

    const top4 = entries.slice(0, 4);
    const rest = entries.slice(4);

    const othersTotal = rest.reduce((sum, [, value]) => sum + value, 0);

    const result = top4.map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);

      return {
        name: category?.name ?? "Unknown",
        value: amount,
      };
    });

    if (othersTotal > 0) {
      result.push({
        name: "Others",
        value: othersTotal,
      });
    }

    result.sort((a, b) => {
      if (a.name === "Others") return 1;
      if (b.name === "Others") return -1;
      return b.value - a.value;
    });

    return result;
  }, [categoryExpense, categories]);

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
        <DashboardComponentDailyExpense data={chartDataDailyExpenses} />
      </DashboardSectionLayout>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-8">
          <DashboardSectionLayout title="Top Expense">
            <DashboardComponentTopExpense data={chartDataTopExpenses} />
          </DashboardSectionLayout>
        </div>
        <div className="col-span-4">
          <DashboardSectionLayout title="Category Expense">
            <DashboardComponentCategoryExpense data={chartDataCategoryExpenses} />
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