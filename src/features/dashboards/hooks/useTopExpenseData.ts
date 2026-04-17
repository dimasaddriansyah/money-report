import { useMemo } from "react";
import type { Transaction } from "../../transactions/types/transaction";

export function useTopExpenseData(transactions: Transaction[]) {
  return useMemo(() => {
    const map = new Map<string, number>();

    transactions
      .filter(row => row.typeId === "TP002")
      .forEach(row => {
        const key = row.remark ?? "-";
        map.set(key, (map.get(key) || 0) + row.amount);
      });

    const sorted = Array.from(map.entries())
      .map(([remark, amount]) => ({ remark, amount }))
      .sort((a, b) => b.amount - a.amount);

    const top10 = sorted.slice(0, 10).reverse();

    return {
      remarks: top10.map(row => row.remark),
      amounts: top10.map(row => row.amount),
    };
  }, [transactions]);
}