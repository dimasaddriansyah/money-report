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

export default function Budgets() {
  const { monthIndex, prev, next, startDate, endDate } = useMonthNavigation();
  const selectedMonth = MONTHS[monthIndex];

  const { budgets, loading } = useBudgets(startDate, endDate);

  const { totalBudget, totalAllocated, balance, percentage, budgetsByAccount } =
    useBudgetSummary(budgets);

  const summaryStyles = getProgressStyles(percentage);

  const { transactions } = useTransactions(startDate, endDate);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-700">
        <Header title="Budgeting" textColor="text-white" />
        {/* <DashboardSkeleton /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-700">
      <Header title="Budgeting" textColor="text-white" />

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
      />

      <BudgetAccountList
        budgetsByAccount={budgetsByAccount}
        totalBudget={totalBudget}
        transactions={transactions}
        getProgressStyles={getProgressStyles}
      />
    </div>
  );
}
