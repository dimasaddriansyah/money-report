import type { Transaction } from "../types/Transactions";

export function calculatePaymentBalances(
  transactions: Transaction[]
) {
  const balances: Record<string, number> = {};

  transactions.forEach((trx) => {
    const nominal = trx.nominal;

    if (!balances[trx.payment]) {
      balances[trx.payment] = 0;
    }

    switch (trx.type) {
      case "income":
        balances[trx.payment] += nominal;
        break;
      case "expenses":
        balances[trx.payment] -= nominal;
        break;
      default:
        break;
    }
  });

  return balances;
}
