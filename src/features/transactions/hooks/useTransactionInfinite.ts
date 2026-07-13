import { useMemo, useState } from "react";
import type { Transaction } from "../types/transaction";

export function useTransactionInfinite(
  transactions: Transaction[],
  initialCount = 15,
) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const visibleTransactions = useMemo(() => {
    return transactions.slice(0, visibleCount);
  }, [transactions, visibleCount]);

  function loadMore() {
    setVisibleCount((prev) => prev + initialCount);
  }

  function reset() {
    setVisibleCount(initialCount);
  }

  return {
    visibleTransactions,
    visibleCount,
    loadMore,
    reset,
  };
}
