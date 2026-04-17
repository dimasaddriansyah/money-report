export function ExportSpreedsheet(format: "xlsx" | "csv" | "pdf" = "xlsx") {
  const spreadsheetId = "1hfMdgqNThzucxyiG3nmMSKrGcXCqpIxRAmbR45iBaDY";

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=${format}`;
}
