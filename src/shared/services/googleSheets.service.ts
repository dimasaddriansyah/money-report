import { GOOGLE_SHEETS_CONFIG } from "../config/googleSheets.config";

const { baseUrl, spreadsheetId, apiKey } = GOOGLE_SHEETS_CONFIG;

export function buildSheetUrl(sheetName: string, range: string) {
  return `${baseUrl}/${spreadsheetId}/values/${sheetName}!${range}?key=${apiKey}`;
}