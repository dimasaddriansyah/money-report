import { GOOGLE_SHEETS_CONFIG } from "./GoogleSheetsConfig";

const { baseUrl, spreadsheetId, apiKey } = GOOGLE_SHEETS_CONFIG;

export function buildSheetUrl(sheetName: string, range: string) {
  return `${baseUrl}/${spreadsheetId}/values/${sheetName}!${range}?key=${apiKey}`;
}
