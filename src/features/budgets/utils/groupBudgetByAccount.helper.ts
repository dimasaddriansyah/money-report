import type { Account } from "../../accounts/types/account";
import { createLookup } from "../../../shared/utils/lookup.helper";
import type { Budget } from "../types/budget";

const ACCOUNT_GROUPS: Record<string, string> = {
  ACC009: "ACC006",
  ACC010: "ACC006",
  ACC013: "ACC006",
};

function getParentAccountId(accountId?: string | null): string {
  return accountId
    ? ACCOUNT_GROUPS[accountId] ?? accountId
    : "";
}

export type GroupedBudget = {
  accountId: string;
  accountName: string;
  total: number;
  items: Budget[];
};

export function groupBudgetByAccount(
  budgets: Budget[],
  accounts: Account[],
): GroupedBudget[] {
  const accountLookup = createLookup(accounts);

  const grouped = budgets.reduce<Record<string, GroupedBudget>>(
    (acc, budget) => {
      const accountId = getParentAccountId(budget.accountId);

      if (!acc[accountId]) {
        acc[accountId] = {
          accountId,
          accountName: accountLookup[accountId] ?? "Unknown Account",
          total: 0,
          items: [],
        };
      }

      acc[accountId].total += budget.amount;
      acc[accountId].items.push(budget);

      return acc;
    },
    {},
  );

  return Object.values(grouped).sort(
    (a, b) => b.total - a.total,
  );
}