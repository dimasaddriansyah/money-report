import { useMemo } from "react";
import { toDate } from "../../../shared/utils/format.helper";
import type { Transaction } from "../types/transaction";

export type TransactionGroup = {
  date: string;
  items: Transaction[];
  totalExpense: number;
};

export function useGroupTransactionsByDate(
  transactions: Transaction[]
) {
  return useMemo(() => {
    const groups = new Map<string, Transaction[]>();

    for (const transaction of transactions) {
      const date = toDate(transaction.date);

      if (!date) continue;

      const dateKey = date.toISOString().split("T")[0];

      const items = groups.get(dateKey);

      if (items) {
        items.push(transaction);
      } else {
        groups.set(dateKey, [transaction]);
      }
    }

    return Array.from(groups.entries())
      .map(([date, items]) => ({
        date,
        items: [...items].sort(
          (a, b) =>
            (toDate(b.date)?.getTime() ?? 0) -
            (toDate(a.date)?.getTime() ?? 0)
        ),
        totalExpense: items
          .filter((item) => item.typeId === "TP002")
          .reduce((sum, item) => sum + item.amount, 0),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions]);
}