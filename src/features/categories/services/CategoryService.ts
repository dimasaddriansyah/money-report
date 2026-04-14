import { buildSheetUrl } from "../../../shared/services/googleSheets.service";
import type { Category } from "../types/category";

export async function fetchCategories(): Promise<Category[]> {
  const url = buildSheetUrl("categories", "A2:D");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();
  const rows = result.values ?? [];

  return rows.map((row: string[]) => ({
    id: row[0],
    name: row[1],
    createdAt: new Date(row[2]),
    updatedAt: new Date(row[3]),
  }));
}
