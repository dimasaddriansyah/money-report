import { useMonthNavigation } from "../../hooks/utils/useMonthNavigation";
import { useBudgets } from "../../hooks/budgets/useBudgets";
import MonthNavigator from "../../components/dashboards/MonthNavigator";
import BudgetSummaryCard from "../../components/budgets/BudgetSummaryCard";
import BudgetAccountList from "../../components/budgets/BudgetAccountList";
import { MONTHS } from "../../helpers/Format";
import { useBudgetSummary } from "../../hooks/budgets/useBudgetSummary";
import { getProgressStyles } from "../../helpers/UI";
import { useTransactions } from "../../hooks/transactions/useTransactions";
import { AddMoneyCircleIcon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomSheet from "../../components/utils/BottomSheet";
import BudgetSkeleton from "../../components/skeletons/BudgetSkeleton";
import ListTransfer from "../../components/budgets/ListTransfer";

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

  const ACCOUNT_GROUP: Record<string, string> = {
    jago: "Jago",
    investment: "Jago",
    bibit: "Jago",
    gopay: "Jago",
  };

  const transferData = Object.entries(budgetsByAccount).reduce(
    (acc, [account, items]) => {
      const key = ACCOUNT_GROUP[account.toLowerCase()] || account;

      const total = items.reduce((sum, item) => sum + item.nominal, 0);

      if (!acc[key]) {
        acc[key] = 0;
      }

      acc[key] += total;

      return acc;
    },
    {} as Record<string, number>,
  );

  const groupedData = Object.entries(transferData)
    .map(([account, total]) => ({
      account,
      total,
    }))
    .sort((a, b) => b.total - a.total);

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
    return <BudgetSkeleton />;
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

      <ListTransfer data={groupedData} />

      {/* Add Budget */}
      <section className="px-4 pb-4 flex">
        <button
          onClick={() => navigate("/budget/create")}
          className="flex flex-1 items-center justify-center gap-2 py-2.5 bg-white/5 border border-dashed border-slate-400 font-semibold text-white rounded-2xl hover:bg-white/20 cursor-pointer"
        >
          <AddMoneyCircleIcon className="w-5 h-5 text-white/50" />
          <span>Add Budgets</span>
        </button>
      </section>

      <div className="flex flex-col rounded-t-3xl bg-slate-700 overflow-hidden">
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
