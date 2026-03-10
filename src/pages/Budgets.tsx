import Header from "../components/navigation/Header";
import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import { useBudgets } from "../hooks/budgets/useBudgets";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import BudgetSummaryCard from "../components/budgets/BudgetSummaryCard";
import BudgetAccountList from "../components/budgets/BudgetAccountList";
import { MONTHS } from "../helpers/Format";
import { useBudgetSummary } from "../hooks/budgets/useBudgetSummary";
import { getProgressStyles } from "../helpers/UI";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { TaskAdd02Icon } from "hugeicons-react";

export default function Budgets() {
  const { monthIndex, prev, next, startDate, endDate } = useMonthNavigation(1);
  const selectedMonth = MONTHS[monthIndex];

  const selectedPeriod = `${endDate.getFullYear()}-${String(
    endDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const { budgets, loading } = useBudgets(startDate, endDate);

  const { totalBudget, totalAllocated, balance, percentage, budgetsByAccount } =
    useBudgetSummary(budgets);

  const summaryStyles = getProgressStyles(percentage);

  const { transactions } = useTransactions(startDate, endDate);

  const currentBudget = budgets[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header title="Budgeting" textColor="text-white" />
        {/* <DashboardSkeleton /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* <Header title="Budgeting" textColor="text-white" /> */}

      <MonthNavigator
        selectedMonth={selectedMonth}
        onPrev={prev}
        onNext={next}
        startDate={startDate}
        endDate={endDate}
      />

      <BudgetSummaryCard
        balance={balance}
        totalBudget={totalBudget}
        totalAllocated={totalAllocated}
        percentage={percentage}
        styles={summaryStyles}
        budget={currentBudget}
        selectedPeriod={selectedPeriod}
      />

      <div className="flex flex-col rounded-t-3xl bg-slate-700 overflow-hidden">
        <button className="flex justify-center items-center text-white font-semibold gap-2 py-3.5 cursor-pointer hover:bg-slate-800">
          <TaskAdd02Icon className="w-5 h-5" />
          <span>Add Budgets</span>
        </button>
        <BudgetAccountList
          budgetsByAccount={budgetsByAccount}
          totalBudget={totalBudget}
          transactions={transactions}
          getProgressStyles={getProgressStyles}
        />
      </div>
    </div>
  );
}
