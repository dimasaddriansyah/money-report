import { useMemo } from "react";
import type { Budget } from "../types/budget";

type Props = {
  budgets: Budget[];
  start: Date;
};

export function useBudgetGetBudget({ budgets, start }: Props) {
  return useMemo(() => {
    const currentPeriod = start.getFullYear() + "-" + String(start.getMonth() + 1).padStart(2, "0");
    const filtered = budgets.filter((b) => b.date.slice(0, 7) === currentPeriod);

    return filtered[0] ?? null;
  }, [budgets, start]);
}