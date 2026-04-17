import { useMemo } from "react";
import type { Transaction } from "../../transactions/types/transaction";

export function useSummaryData(transactions: Transaction[]) {
  return useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.typeId === "TP001")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.typeId === "TP002")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions: transactions.length,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);
}