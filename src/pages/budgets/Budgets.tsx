import Header from "../../components/navigation/Header";
import { useMonthNavigation } from "../../hooks/utils/useMonthNavigation";
import { useBudgets } from "../../hooks/budgets/useBudgets";
import MonthNavigator from "../../components/dashboards/MonthNavigator";
import BudgetSummaryCard from "../../components/budgets/BudgetSummaryCard";
import BudgetAccountList from "../../components/budgets/BudgetAccountList";
import { MONTHS } from "../../helpers/Format";
import { useBudgetSummary } from "../../hooks/budgets/useBudgetSummary";
import { getProgressStyles } from "../../helpers/UI";
import { useTransactions } from "../../hooks/transactions/useTransactions";
import { TaskAdd02Icon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomSheet from "../../components/utils/BottomSheet";

export default function Budgets() {
  const navigate = useNavigate();
  const { monthIndex, prev, next, startDate, endDate } = useMonthNavigation(1);
  const selectedMonth = MONTHS[monthIndex];

  const selectedPeriod = `${endDate.getFullYear()}-${String(
    endDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const { budgets, loading, deleteBudget } = useBudgets(startDate, endDate);

  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { totalBudget, totalAllocated, balance, percentage, budgetsByAccount } =
    useBudgetSummary(budgets);

  const summaryStyles = getProgressStyles(percentage);

  const { transactions } = useTransactions(startDate, endDate);

  const currentBudget = budgets[0];

  const handleDeleteRequest = (id: string) => {
    setSelectedBudget(id);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBudget) return;

    setLoadingDelete(true);

    const success = await deleteBudget(selectedBudget);

    if (success) {
      setSelectedBudget(null);
    }

    setLoadingDelete(false);
  };

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
        <button
          onClick={() => navigate("/budget/create")}
          className="flex justify-center items-center text-white font-semibold gap-2 py-3.5 cursor-pointer hover:bg-slate-800"
        >
          <TaskAdd02Icon className="w-5 h-5" />
          <span>Add Budgets</span>
        </button>
        <BudgetAccountList
          budgetsByAccount={budgetsByAccount}
          totalBudget={totalBudget}
          transactions={transactions}
          getProgressStyles={getProgressStyles}
          onDeleteRequest={handleDeleteRequest}
        />
      </div>

      <BottomSheet
        open={!!selectedBudget}
        onClose={() => setSelectedBudget(null)}
        title="Delete Budget"
      >
        {selectedBudget && (
          <div className="flex flex-col gap-5">
            <span>Apakah anda yakin ingin menghapus budget ini?</span>

            <button
              onClick={handleConfirmDelete}
              disabled={loadingDelete}
              className="w-full bg-red-700 hover:bg-red-500 text-white font-semibold py-3 rounded-full flex items-center justify-center min-h-12"
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
