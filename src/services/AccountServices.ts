import { buildSheetUrl } from "./GoogleSheetsService";
import { formatISODatetoID } from "../helpers/Format";

export async function fetchAccounts(): Promise<Accounts[]> {
  const url = buildSheetUrl("accounts", "A2:I");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }

  const result = await response.json();
  const rows = result.values ?? [];

  return rows.map((row: string[]) => ({
    account_id: row[0],
    name: row[1],
    inserted_date: formatISODatetoID(row[2]),
    updated_date: formatISODatetoID(row[3]),
  }));
}
