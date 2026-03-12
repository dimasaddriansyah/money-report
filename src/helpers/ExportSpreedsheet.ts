import { GOOGLE_SHEETS_CONFIG } from "../services/GoogleSheetsConfig";

export function ExportSpreedsheet(format: "xlsx" | "csv" | "pdf" = "xlsx") {
  const { spreadsheetId } = GOOGLE_SHEETS_CONFIG;

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=${format}`;
}
