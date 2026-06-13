import type { Transaction } from "../../transactions/types/transaction";
import type { Budget } from "../types/budget";

export function getSpendingByBudget(
  budgets: Budget[],
  transactions: Transaction[]
) {
  return budgets.map((budget) => {
    const spending = transactions
      .filter(
        (t) =>
          t.toAccountId === budget.accountId &&
          t.remark === budget.remark
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...budget,
      spending,
      saving: budget.amount - spending,
      usagePercent: budget.amount
        ? (spending / budget.amount) * 100
        : 0,
    };
  });
}