import type { Budget } from "../types/budget";

export function getBudgetByPeriod(budgets: Budget[], date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();

  const primary = budgets.find((b) => {
    if (!b.date) return false;

    const d = new Date(b.date);

    return (
      !b.accountId &&
      b.remark === "Budget" &&
      d.getMonth() === month &&
      d.getFullYear() === year
    );
  });

  const details = budgets.filter((b) => {
    if (!b.date) return false;

    const d = new Date(b.date);

    return (
      b.accountId &&
      d.getMonth() === month &&
      d.getFullYear() === year
    );
  });

  return { primary, details };
}