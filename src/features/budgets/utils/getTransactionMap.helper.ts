import type { Transaction } from "../../transactions/types/transaction";
import { filterTransactionByPeriod } from "./filterTransactionByPeriod.helper";
import { mapTransactionByAccount } from "./mapTransactionByAccount.helper";
import { mapTransactionByCategory } from "./mapTransactionByCategory.helper";
import { mapTransactionByRemark } from "./mapTransactionByRemark.helper";

export type TransactionMap = {
  byRemark: Record<string, number>;
  byAccount: Record<string, number>;
  byCategory: Record<string, number>;
  byCategoryAccount: Record<string, number>;
};

export function getTransactionMap(
  transactions: Transaction[],
  start: Date
): TransactionMap {
  const filtered = filterTransactionByPeriod(transactions, start);
  const byCategoryAccount: Record<string, number> = {};

  for (const trx of filtered) {
    const cat = trx.categoryId;
    const acc = trx.fromAccountId;
    const amount = trx.amount;

    if (cat && acc) {
      const key = `${cat}__${acc}`;
      byCategoryAccount[key] =
        (byCategoryAccount[key] ?? 0) + amount;
    }
  }

  return {
    byRemark: mapTransactionByRemark(filtered),
    byAccount: mapTransactionByAccount(filtered),
    byCategory: mapTransactionByCategory(filtered),
    byCategoryAccount,
  };
}