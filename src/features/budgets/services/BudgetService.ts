import { buildSheetUrl } from "../../../shared/services/googleSheets.service";
import { parseRupiah } from "../../../shared/utils/format.helper";
import type { Budget } from "../types/budget";

export async function fetchBudgets(): Promise<Budget[]> {
  const url = buildSheetUrl("budgets", "A2:E");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch budgets");
  }

  const result = await response.json();
  const rows = result.values ?? [];

  return rows.map((row: string[]) => ({
    id: row[0],
    date: row[1],
    accountId: row[2] || undefined,
    remark: row[3] || "",
    amount: parseRupiah(row[4]),
  }));
}
