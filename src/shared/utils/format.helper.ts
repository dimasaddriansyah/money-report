export function formatDateToString(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateDisplay(value: string) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getDay(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

export function parseRupiah(value: string): number {
  return Number(value?.replace("Rp", "").replace(/\./g, "").trim() || 0);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}
