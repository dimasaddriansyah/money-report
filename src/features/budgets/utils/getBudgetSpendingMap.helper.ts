import type { Transaction } from "../../transactions/types/transaction";
import type { Budget } from "../types/budget";

type BudgetRule = {
  accountField: "from" | "to";
  categoryIds: string[];
  remarkMatch?: string;
};

const BUDGET_RULES = new Map<string, BudgetRule>([
  ["ACC014|Uang Pribadi", { accountField: "from", categoryIds: ["CAT001", "CAT002"] }],
  ["ACC013|Member Parkir", { accountField: "from", categoryIds: ["CAT014"] }],
  ["ACC006|Kuota", { accountField: "from", categoryIds: ["CAT014"], remarkMatch: "Kuota" }],
  ["ACC006|Bensin", { accountField: "from", categoryIds: ["CAT004"] }],
  ["ACC005|Uang Bersama", { accountField: "from", categoryIds: ["CAT001"] }],
  ["ACC009|RDPU Bahana Liquid Syariah Kelas G", { accountField: "to", categoryIds: ["CAT022"] }],
  ["ACC010|Married Saving", { accountField: "to", categoryIds: ["CAT022"], remarkMatch: "Married Saving" }],
]);

function buildRuleKey(accountId: string, remark: string) { return `${accountId}|${remark}` }

function buildTransactionKey(
  accountField: "from" | "to",
  accountId: string,
  categoryId: string,
) { return `${accountField}|${accountId}|${categoryId}` }

export function getBudgetSpendingMap(
  budgets: Budget[],
  transactions: Transaction[],
): Map<string, number> {
  const spendingMap = new Map<string, number>();
  const transactionIndex = new Map<string, number>();

  const addTransaction = (key: string, amount: number) => {
    transactionIndex.set(key, (transactionIndex.get(key) ?? 0) + amount);
  };

  // Build transaction index
  for (const trx of transactions) {
    if (trx.fromAccountId && trx.categoryId) {
      addTransaction(
        buildTransactionKey("from", trx.fromAccountId, trx.categoryId),
        trx.amount,
      );
    }

    if (trx.toAccountId && trx.categoryId) {
      addTransaction(
        buildTransactionKey("to", trx.toAccountId, trx.categoryId),
        trx.amount,
      );
    }
  }

  // Calculate spending
  for (const budget of budgets) {
    if (!budget.accountId) {
      spendingMap.set(budget.id, 0);
      continue;
    }

    const rule = BUDGET_RULES.get(
      buildRuleKey(budget.accountId, budget.remark),
    );

    let spending = 0;

    if (rule) {
      for (const categoryId of rule.categoryIds) {
        const remarkMatch = rule.remarkMatch;

        if (remarkMatch) {
          spending += transactions
            .filter((trx) => {
              const accountId =
                rule.accountField === "to"
                  ? trx.toAccountId
                  : trx.fromAccountId;

              return (
                accountId === budget.accountId &&
                trx.categoryId === categoryId &&
                trx.remark?.includes(remarkMatch)
              );
            })
            .reduce((sum, trx) => sum + trx.amount, 0);

          continue;
        }

        const key = buildTransactionKey(
          rule.accountField,
          budget.accountId,
          categoryId,
        );

        spending += transactionIndex.get(key) ?? 0;
      }
    } else {
      spending = transactions
        .filter(
          (trx) =>
            trx.fromAccountId === budget.accountId &&
            trx.remark === budget.remark,
        )
        .reduce((sum, trx) => sum + trx.amount, 0);
    }

    spendingMap.set(budget.id, spending);
  }

  return spendingMap;
}