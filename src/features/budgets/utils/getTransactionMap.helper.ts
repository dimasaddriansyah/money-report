import type { Transaction } from "../../transactions/types/transaction";
import { filterTransactionByPeriod } from "./filterTransactionByPeriod.helper";
import { mapTransactionByAccount } from "./mapTransactionByAccount.helper";
import { mapTransactionByCategory } from "./mapTransactionByCategory.helper";
import { mapTransactionByRemark } from "./mapTransactionByRemark.helper";

export type TransactionMap = {
  byRemark: Record<string, number>;
  byAccount: Record<string, number>;
  byCategory: Record<string, number>;
};

export function getTransactionMap(
  transactions: Transaction[],
  start: Date
): TransactionMap {
  const filtered = filterTransactionByPeriod(transactions, start);

  return {
    byRemark: mapTransactionByRemark(filtered),
    byAccount: mapTransactionByAccount(filtered),
    byCategory: mapTransactionByCategory(filtered)
  };
}