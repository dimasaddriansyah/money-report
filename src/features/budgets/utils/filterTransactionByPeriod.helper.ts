import type { Transaction } from "../../transactions/types/transaction";

export function filterTransactionByPeriod(
  transactions: Transaction[],
  start: Date
) {
  const currentPeriod =
    start.getFullYear() +
    "-" +
    String(start.getMonth() + 1).padStart(2, "0");

  return transactions.filter(
    (t) => t.date.slice(0, 7) === currentPeriod
  );
}