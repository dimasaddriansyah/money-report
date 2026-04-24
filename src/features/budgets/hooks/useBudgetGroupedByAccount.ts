import { useMemo } from "react";
import type { Budget } from "../types/budget";

type Account = {
  id: string;
  name: string;
};

type Props = {
  budgets: Budget[];
  month: string; // "YYYY-MM"
  accounts: Account[];
};

type BudgetGroup = {
  accountId: string;
  accountName: string;
  budgets: Budget[];
  total: number;
};

export function useBudgetGroupedByAccount({
  budgets,
  month,
  accounts,
}: Props): BudgetGroup[] {
  return useMemo(() => {
    const filtered = budgets.filter((b) => {
      if (!b.accountId) return false;
      return b.date === month;
    });

    const map = new Map<string, Budget[]>();

    for (const b of filtered) {
      const key = b.accountId;

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)!.push(b);
    }

    const accountMap = new Map(accounts.map((a) => [a.id, a]));

    return Array.from(map.entries()).map(([accountId, budgets]) => {
      const account = accountMap.get(accountId);

      const total = budgets.reduce((sum, b) => sum + b.amount, 0);

      return {
        accountId,
        accountName: account?.name ?? "Unknown",
        budgets,
        total,
      };
    });
  }, [budgets, month, accounts]);
}