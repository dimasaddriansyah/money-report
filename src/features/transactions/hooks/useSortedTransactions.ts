import { useMemo } from "react";
import type { Transaction } from "../types/transaction";

export function useSortedTransactions(transactions: Transaction[]) {
  return useMemo(() => {
    return [...transactions].sort((a, b) => b.date.toMillis() - a.date.toMillis());
  }, [transactions]);
}
