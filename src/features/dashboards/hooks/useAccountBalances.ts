import { useMemo } from "react";
import type { Account } from "../../accounts/types/account";
import type { Transaction } from "../../transactions/types/transaction";

export function useAccountBalances(
  transactions: Transaction[],
  accounts: Account[]
) {
  const balances = useMemo(() => {
    const result: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.typeId === "TP001" && t.toAccountId) {
        result[t.toAccountId] = (result[t.toAccountId] || 0) + t.amount;
      }

      if (t.typeId === "TP002" && t.fromAccountId) {
        result[t.fromAccountId] = (result[t.fromAccountId] || 0) - t.amount;
      }

      if (t.typeId === "TP003") {
        if (t.fromAccountId) {
          result[t.fromAccountId] = (result[t.fromAccountId] || 0) - t.amount;
        }
        if (t.toAccountId) {
          result[t.toAccountId] = (result[t.toAccountId] || 0) + t.amount;
        }
      }
    });

    return result;
  }, [transactions]);

  return useMemo(() => {
    return accounts
      .map(acc => ({
        ...acc,
        balance: balances[acc.id] ?? 0,
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [accounts, balances]);
}