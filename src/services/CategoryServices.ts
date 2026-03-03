import type { Categories } from "../types/Categories";
import { buildSheetUrl } from "./GoogleSheetsService";
import { formatISODatetoID } from "../helpers/Format";

export async function fetchCategories(): Promise<Categories[]> {
  const url = buildSheetUrl("categories", "A2:I");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();
  const rows = result.values ?? [];

  return rows.map((row: string[]) => ({
    category_id: row[0],
    name: row[1],
    inserted_date: formatISODatetoID(row[2]),
    updated_date: formatISODatetoID(row[3]),
  }));
}
