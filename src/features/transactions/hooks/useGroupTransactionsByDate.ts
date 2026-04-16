import { useMemo } from "react";
import type { Transaction } from "../types/transaction";

type GroupedTransactions = {
  date: string;
  items: Transaction[];
  totalExpense: number;
};

export function useGroupTransactionsByDate(transactions: Transaction[]) {
  return useMemo(() => {
    const map = new Map<string, Transaction[]>();

    transactions.forEach((trx) => {
      const dateKey = new Date(trx.date).toISOString().split("T")[0];
      if (!map.has(dateKey)) { map.set(dateKey, []) }
      map.get(dateKey)!.push(trx);
    });

    const result: GroupedTransactions[] = Array.from(map.entries())
      .map(([date, items]) => {
        const sortedItems = items
        .sort((a, b) => new Date(b.date)
        .getTime() - new Date(a.date)
        .getTime());
        const totalExpense = items
          .filter((t) => t.typeId === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          date,
          items: sortedItems,
          totalExpense,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
    return result;
  }, [transactions]);
}