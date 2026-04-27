import type { Transaction } from "../../transactions/types/transaction";

export function mapTransactionByRemark(transactions: Transaction[]) {
  return transactions.reduce((acc, t) => {
    const key = t.remark?.toLowerCase();
    if (!key) return acc;

    if (!acc[key]) acc[key] = 0;
    acc[key] += t.amount;

    return acc;
  }, {} as Record<string, number>);
}