import { GOOGLE_SHEETS_CONFIG } from "../config/googleSheets.config";

export function ExportSpreedsheet(format: "xlsx" | "csv" | "pdf" = "xlsx") {
  const { spreadsheetId } = GOOGLE_SHEETS_CONFIG;

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=${format}`;
}
