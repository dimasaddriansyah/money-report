import type { Account } from "../../accounts/types/account";
import type { Budget } from "../types/budget";

const ACCOUNT_GROUPS: Record<string, string> = {
  ACC009: "ACC006",
  ACC010: "ACC006",
};

function getParentAccountId(accountId: string) {
  return ACCOUNT_GROUPS[accountId] ?? accountId;
}

export type GroupedBudget = {
  accountId: string;
  accountName: string;
  total: number;
  items: Budget[];
};

export function groupBudgetByAccount(
  budgets: Budget[],
  accounts: Account[]
): GroupedBudget[] {
  const accountMap = new Map(
    accounts.map(account => [account.id, account])
  );

  return Object.values(
    budgets.reduce<Record<string, GroupedBudget>>((acc, budget) => {
      const accountId = getParentAccountId(
        budget.accountId ?? ""
      );

      if (!acc[accountId]) {
        acc[accountId] = {
          accountId,
          accountName:
            accountMap.get(accountId)?.name ??
            "Unknown Account",
          total: 0,
          items: [],
        };
      }

      acc[accountId].total += budget.amount;
      acc[accountId].items.push(budget);

      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);
}