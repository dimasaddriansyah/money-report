import type { Transaction } from "../../transactions/types/transaction";

export function mapTransactionByAccount(transactions: Transaction[]) {
  return transactions.reduce((acc, t) => {
    const key = t.fromAccountId;
    if (!key) return acc;

    if (!acc[key]) acc[key] = 0;
    acc[key] += t.amount;

    return acc;
  }, {} as Record<string, number>);
}