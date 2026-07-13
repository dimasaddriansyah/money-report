import { useMemo } from "react";
import type { Transaction } from "../../transactions/types/transaction";
import { formatDateDayMonth, normalizeDate, } from "../../../shared/utils/format.helper";

export function useDailyExpenseData(transactions: Transaction[]) {
  return useMemo(() => {
    const dailyExpense = new Map<string, number>();

    transactions.forEach((transaction) => {
      if (transaction.typeId !== "TP002") return;
      const date = normalizeDate(transaction.date);
      dailyExpense.set(date, (dailyExpense.get(date) ?? 0) + transaction.amount);
    });

    const entries = [...dailyExpense.entries()].sort(
      ([a], [b]) => a.localeCompare(b)
    );

    return {
      dates: entries.map(([date]) => formatDateDayMonth(date)),
      amounts: entries.map(([, amount]) => amount),
    };
  }, [transactions]);
}