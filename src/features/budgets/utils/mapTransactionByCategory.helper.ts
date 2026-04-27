import type { Transaction } from "../../transactions/types/transaction";

export function mapTransactionByCategory(transactions: Transaction[]) {
  return transactions.reduce((acc, t) => {
    const key = t.categoryId;
    if (!key) return acc;

    if (!acc[key]) acc[key] = 0;
    acc[key] += t.amount;

    return acc;
  }, {} as Record<string, number>);
}