import type { Transaction } from "../types/Transactions";

export function calculateNetCashflow(transactions: Transaction[]) {
  return transactions.reduce((acc, trx) => {
    const nominal = trx.nominal;

    switch (trx.type) {
      case "income":
        return acc + nominal;
      case "expenses":
        return acc - nominal;
      default:
        return acc;
    }
  }, 0);
}
