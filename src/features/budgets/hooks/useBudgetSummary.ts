import { useMemo } from "react";
import type { Account } from "../../accounts/types/account";
import type { Transaction } from "../../transactions/types/transaction";
import type { Budget } from "../types/budget";
import { toDate } from "../../../shared/utils/format.helper";
import { getBudgetByPeriod } from "../utils/getBudgetByPeriod.helper";
import { groupBudgetByAccount } from "../utils/groupBudgetByAccount.helper";
import { getBudgetSpendingMap } from "../utils/getBudgetSpendingMap.helper";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  transactions: Transaction[];
  start: Date;
  end: Date;
};

export function useBudgetSummary({
  budgets,
  accounts,
  transactions,
  start,
  end,
}: Props) {
  const transactionsInPeriod = useMemo(
    () =>
      transactions.filter((trx) => {
        const date = toDate(trx.date);
        return date && date >= start && date <= end;
      }),
    [transactions, start, end]
  );

  const { primary, details } = useMemo(
    () => getBudgetByPeriod(budgets, start, end),
    [budgets, start, end]
  );

  const groupedBudgets = useMemo(
    () => groupBudgetByAccount(details, accounts),
    [details, accounts]
  );

  const spendingMap = useMemo(
    () => getBudgetSpendingMap(details, transactionsInPeriod),
    [details, transactionsInPeriod]
  );

  const budgetAmount = primary?.amount ?? 0;

  const totalAllocation = groupedBudgets.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const remainingBudget = budgetAmount - totalAllocation;

  const summary = {
    budgetAmount,
    totalAllocation,
    remainingBudget,
    remainingPercent:
      budgetAmount > 0
        ? (remainingBudget / budgetAmount) * 100
        : 0,
    isOverBudget: totalAllocation > budgetAmount,
  };

  const allocationItems = useMemo(
    () =>
      groupedBudgets.map((item) => ({
        ...item,
        percent:
          budgetAmount > 0
            ? (item.total / budgetAmount) * 100
            : 0,
      })),
    [groupedBudgets, budgetAmount]
  );

  const budgetItems = useMemo(
    () =>
      details.map((budget) => {
        const spent = spendingMap.get(budget.id) ?? 0;

        const account = accounts.find(
          (item) => item.id === budget.accountId
        );

        return {
          ...budget,
          accountName: account?.name ?? "-",
          spent,
          remaining: budget.amount - spent,
          progress:
            budget.amount > 0
              ? Math.min(
                (spent / budget.amount) * 100,
                100
              )
              : 0,
          isOverBudget: spent > budget.amount,
        };
      }),
    [details, spendingMap, accounts]
  );

  return {
    primary,

    summary,

    allocationItems,

    budgetItems,

    isEmpty: details.length === 0,
  };
}