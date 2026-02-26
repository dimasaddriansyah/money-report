import type { Transaction } from "../types/Transactions";
import { buildSheetUrl } from "./GoogleSheetsService";
import { formatISOToID } from "../helpers/Format";

export async function fetchTransactions(): Promise<Transaction[]> {
  const url = buildSheetUrl("transactions", "A2:I");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const result = await response.json();
  const rows = result.values ?? [];

  return rows.map((row: string[]) => ({
    transaction_id: row[0],
    date: formatISOToID(row[2]),
    type: row[3].toLowerCase() as Transaction["type"],
    category: row[4],
    remark: row[5],
    from_account: row[6],
    to_account: row[7],
    nominal: Number(row[8].replace(/[^\d-]/g, "")),
  }));
}
