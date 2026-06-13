import type { Account } from "../../accounts/types/account";
import type { Budget } from "../types/budget";

export function groupBudgetByOriginalAccount(
  budgets: Budget[],
  accounts: Account[]
) {
  const accountMap = new Map(
    accounts.map(account => [account.id, account])
  );

  return Object.values(
    budgets.reduce((acc, budget) => {
      const accountId = budget.accountId ?? "";

      if (!acc[accountId]) {
        acc[accountId] = {
          accountId,
          accountName:
            accountMap.get(accountId)?.name ??
            "Unknown Account",
          total: 0,
        };
      }

      acc[accountId].total += budget.amount;

      return acc;
    }, {} as Record<
      string,
      {
        accountId: string;
        accountName: string;
        total: number;
      }
    >)
  ).sort((a, b) => b.total - a.total);
}