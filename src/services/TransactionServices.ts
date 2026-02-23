import type { Transaction } from "../types/Transactions";
import { buildSheetUrl } from "./GoogleSheetsService";
import { convertToISO } from "../helpers/Format";

export async function fetchTransactions(): Promise<Transaction[]> {
  const url = buildSheetUrl("transactions", "A2:K");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const result = await response.json();
  const rows = result.values ?? [];

  return rows.map((row: string[]) => ({
    transaction_id: row[0],
    date: convertToISO(row[2]),
    type: row[3].toLowerCase() as Transaction["type"],
    payment: row[4],
    category: row[5],
    remark: row[6],
    nominal: Number(row[7].replace(/[^\d-]/g, "")),
  }));
}
