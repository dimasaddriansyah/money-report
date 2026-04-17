import { useMemo } from "react";
import type { Transaction } from "../../transactions/types/transaction";
import { formatDateDayMonth } from "../../../shared/utils/format.helper";

export function useDailyExpenseData(transactions: Transaction[]) {
  return useMemo(() => {
    const map: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.typeId !== "TP002") return;

      const date = new Date(t.date).toISOString().split("T")[0];
      map[date] = (map[date] || 0) + t.amount;
    });

    const entries = Object.entries(map).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    return {
      dates: entries.map(([d]) => formatDateDayMonth(d)),
      amounts: entries.map(([, v]) => v),
    };
  }, [transactions]);
}