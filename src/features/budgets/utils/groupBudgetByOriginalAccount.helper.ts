import { createLookup } from "../../../shared/utils/lookup.helper";
import type { Account } from "../../accounts/types/account";
import type { Budget } from "../types/budget";

type OriginalBudgetGroup = {
  accountId: string;
  accountName: string;
  total: number;
};

function getAccountId(accountId?: string | null): string {
  return accountId ?? "";
}

export function groupBudgetByOriginalAccount(
  budgets: Budget[],
  accounts: Account[],
): OriginalBudgetGroup[] {
  const accountLookup = createLookup(accounts);

  const grouped = budgets.reduce<Record<string, OriginalBudgetGroup>>(
    (acc, budget) => {
      const accountId = getAccountId(budget.accountId);

      if (!acc[accountId]) {
        acc[accountId] = {
          accountId,
          accountName: accountLookup[accountId] ?? "Unknown Account",
          total: 0,
        };
      }

      acc[accountId].total += budget.amount;

      return acc;
    },
    {},
  );

  return Object.values(grouped).sort(
    (a, b) => b.total - a.total,
  );
}