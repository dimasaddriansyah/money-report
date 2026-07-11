import { toDate } from "../../../shared/utils/format.helper";
import type { Budget } from "../types/budget";

export function getBudgetByPeriod(
  budgets: Budget[],
  start: Date,
  end: Date,
) {
  const isInPeriod = (date: Date | null) =>
    !!date &&
    date >= start &&
    date <= end;

  const primary = budgets.find(
    (budget) =>
      !budget.accountId &&
      budget.remark === "Budget" &&
      isInPeriod(toDate(budget.date)),
  );

  const details = budgets.filter(
    (budget) =>
      !!budget.accountId &&
      isInPeriod(toDate(budget.date)),
  );

  return {
    primary,
    details,
  };
}