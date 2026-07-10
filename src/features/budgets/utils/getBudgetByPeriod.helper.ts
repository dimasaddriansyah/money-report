import { toDate } from "../../../shared/utils/format.helper";
import type { Budget } from "../types/budget";

export function getBudgetByPeriod(
  budgets: Budget[],
  period: Date
) {
  const month = period.getMonth();
  const year = period.getFullYear();

  const isSamePeriod = (date: Date | null) =>
    !!date &&
    date.getMonth() === month &&
    date.getFullYear() === year;

  const primary = budgets.find((budget) =>
    !budget.accountId &&
    budget.remark === "Budget" &&
    isSamePeriod(toDate(budget.date))
  );

  const details = budgets.filter((budget) =>
    budget.accountId &&
    isSamePeriod(toDate(budget.date))
  );

  return {
    primary,
    details,
  };
}