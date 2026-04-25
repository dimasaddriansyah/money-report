import { useMemo } from "react";
import type { Budget } from "../types/budget";

type Account = {
  id: string;
  name: string;
};

type Props = {
  budgets: Budget[];
  start: Date;
  end: Date;
  accounts: Account[];
};

type BudgetGroup = {
  accountId: string;
  accountName: string;
  budgets: Budget[];
  total: number;
};

// helper aman (hindari timezone bug)
function toDateOnly(date: string) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function useBudgetGroupedByAccount({
  budgets,
  start,
  end,
  accounts,
}: Props): BudgetGroup[] {
  return useMemo(() => {
    const startTime = start.getTime();
    const endTime = end.getTime();

    const filtered = budgets.filter((b) => {
      if (!b.accountId || !b.date) return false;

      const d = toDateOnly(b.date).getTime();

      return d >= startTime && d <= endTime;
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
  }, [budgets, start, end, accounts]);
}