export function formatDateFull(value: string) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateDayMonthYear(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateDayMonth(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
  });
}

export function formatDateYear(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    year: "numeric",
  });
}

export function formatDateMonth(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    month: "long",
  });
}

export function formatDateDay(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

export function formatDateInput(date: string | Date = new Date()) {
  if (typeof date === "string" && date.includes("T")) {
    return date.slice(0, 10);
  }

  if (typeof date === "string") {
    return date;
  }

  return new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });
}

export function normalizeDate(date?: string) {
  if (!date) {
    return new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
  }

  if (date.includes("T")) {
    const d = new Date(date);

    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    ).toLocaleDateString("en-CA");
  }

  return date;
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

export function formatBalance(value: string, hide: boolean) {
  return hide ? "Rp ••••••••" : value;
}

const parseNominal = (value: string): number =>
  Number(value.replace(/[^\d-]/g, "")) || 0;

export const parseSmartNominal = (value: string): number => {
  value = value.toLowerCase().replace(",", ".");

  if (value.includes("jt")) {
    return parseFloat(value.replace("jt", "")) * 1_000_000;
  }

  if (value.includes("k") || value.includes("rb")) {
    return parseFloat(value.replace("k", "").replace("rb", "")) * 1_000;
  }

  return parseNominal(value);
};
