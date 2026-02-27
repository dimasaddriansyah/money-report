import { formatISOToID } from "../helpers/Format";
import type { Budgets } from "../types/Budgets";
import { buildSheetUrl } from "./GoogleSheetsService";

export async function fetchBudgets(): Promise<Budgets[]> {
  const url = buildSheetUrl("budgets", "A2:I");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch budgets");
  }

  const result = await response.json();
  const rows = result.values ?? [];

  return rows.map((row: string[]) => ({
    budget_id: row[0],
    date: formatISOToID(row[1]),
    account: row[2],
    remark: row[3],
    nominal: Number(row[4].replace(/[^\d-]/g, "")),
  }));
}
