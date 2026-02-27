import { useMemo } from "react";
import type { Budgets } from "../../types/Budgets";

export function useBudgetSummary(budgets: Budgets[]) {
  const result = useMemo(() => {
    const totalBudgetItem = budgets.find(
      (row) => row.remark === "Budget" && (!row.account || row.account === ""),
    );

    const totalBudget = totalBudgetItem?.nominal ?? 0;

    const detailBudgets = budgets.filter((row) => row.remark !== "Budget");

    const totalAllocated = detailBudgets.reduce(
      (sum, item) => sum + (item.nominal || 0),
      0,
    );

    const balance = totalBudget - totalAllocated;

    const percentage =
      totalBudget > 0
        ? Math.min(Math.floor((totalAllocated / totalBudget) * 100), 100)
        : 0;

    const budgetsByAccount = detailBudgets.reduce(
      (acc, item) => {
        const key = item.account || "Tanpa Akun";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, Budgets[]>,
    );

    return {
      totalBudget,
      totalAllocated,
      balance,
      percentage,
      budgetsByAccount,
    };
  }, [budgets]);

  return result;
}
