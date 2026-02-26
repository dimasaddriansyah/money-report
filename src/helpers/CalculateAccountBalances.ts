import type { Transaction } from "../types/Transactions";

export function calculateAccountBalances(transactions: Transaction[]) {
  const balances: Record<string, number> = {};

  const adjust = (account: string | undefined, amount: number) => {
    if (!account) return;
    balances[account] = (balances[account] || 0) + amount;
  };

  transactions.forEach((trx) => {
    const nominal = trx.nominal;

    if (trx.type === "income") {
      adjust(trx.to_account, nominal);
    }

    if (trx.type === "expenses") {
      adjust(trx.from_account, -nominal);
    }

    if (trx.type === "transfer") {
      adjust(trx.from_account, -nominal);
      adjust(trx.to_account, nominal);
    }
  });

  return balances;
}
