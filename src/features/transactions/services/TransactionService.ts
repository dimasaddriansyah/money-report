import { buildSheetUrl } from "../../../shared/services/googleSheets.service";
import { parseRupiah } from "../../../shared/utils/format.helper";
import type { Transaction, TransactionType } from "../types/transaction";

export async function fetchTransactions(): Promise<Transaction[]> {
  const url = buildSheetUrl("transactions", "A2:I");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const result = await response.json();
  const rows = result.values ?? [];

  return rows.map((row: string[]) => ({
    id: row[0],
    date: row[2],
    type: row[3].toLowerCase() as TransactionType,
    categoryId: row[4] || undefined,
    fromAccountId: row[5] || undefined,
    toAccountId: row[6] || undefined,
    remark: row[7] || "",
    amount: parseRupiah(row[8]),
  }));
}
