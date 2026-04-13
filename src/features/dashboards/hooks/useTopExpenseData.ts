import { useMemo } from "react";
import type { Transaction } from "../../transactions/types/transaction";

export function useTopExpenseData(transactions: Transaction[]) {
  return useMemo(() => {
    const top10 = transactions
      .filter(t => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .reverse();

    return {
      remarks: top10.map(t => t.remark ?? "-"),
      amounts: top10.map(t => t.amount),
    };
  }, [transactions]);
}