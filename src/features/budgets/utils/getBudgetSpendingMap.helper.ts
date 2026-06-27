import type { Budget } from "../types/budget";
import type { Transaction } from "../../transactions/types/transaction";

type BudgetRule = {
  accountField: "from" | "to";
  categoryIds: string[];
  remarkMatch?: string;
};

const BUDGET_RULES = new Map<string, BudgetRule>([
  ["ACC012|Makan Pribadi", { accountField: "from", categoryIds: ["CAT001","CAT002"] }],
  ["ACC013|Member Parkir", { accountField: "from", categoryIds: ["CAT014"]}],
  ["ACC006|Kuota", { accountField: "from", categoryIds: ["CAT014"], remarkMatch: "Kuota" }],
  ["ACC006|Bensin", { accountField: "from", categoryIds: ["CAT004"] }],
  ["ACC005|Uang Bersama", { accountField: "from", categoryIds: ["CAT001"] }],
  ["ACC009|RDPU Bahana Liquid Syariah Kelas G", { accountField: "to", categoryIds: ["CAT022"] }],
  ["ACC010|Married Saving", {
    accountField: "to",
    categoryIds: ["CAT022"],
    remarkMatch: "Married Saving"
  }]
]);

export function getBudgetSpendingMap(
  budgets: Budget[],
  transactions: Transaction[],
): Map<string, number> {
  const spendingMap = new Map<string, number>();
  const transactionIndex = new Map<string, number>();

  for (const trx of transactions) {
    if (trx.fromAccountId && trx.categoryId) {
      const key = `from|${trx.fromAccountId}|${trx.categoryId}`;
      transactionIndex.set(key, (transactionIndex.get(key) ?? 0) + trx.amount);
    }

    if (trx.toAccountId && trx.categoryId) {
      const key = `to|${trx.toAccountId}|${trx.categoryId}`;
      transactionIndex.set(key, (transactionIndex.get(key) ?? 0) + trx.amount);
    }
  }

  // HITUNG BUDGET
  for (const budget of budgets) {
    const ruleKey = `${budget.accountId}|${budget.remark}`;
    const rule = BUDGET_RULES.get(ruleKey);

    let spending = 0;

    if (rule) {
      for (const categoryId of rule.categoryIds) {
        const trxKey = `${rule.accountField}|${budget.accountId}|${categoryId}`;
        const baseAmount = transactionIndex.get(trxKey) ?? 0;

        if (rule.remarkMatch) {
          const filtered = transactions
            .filter(
              (trx) =>
                trx.categoryId === categoryId &&
                trx.remark?.includes(rule.remarkMatch!) &&
                (rule.accountField === "to"
                  ? trx.toAccountId
                  : trx.fromAccountId) === budget.accountId,
            )
            .reduce((sum, trx) => sum + trx.amount, 0);
          spending += filtered;
        } else {
          spending += baseAmount;
        }
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
