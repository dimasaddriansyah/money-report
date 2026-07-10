import { Timestamp } from "firebase/firestore";

// ----------------------------------------------------------------------------
// DATE
// ----------------------------------------------------------------------------
export type DateValue =
  | Timestamp
  | Date
  | string
  | null
  | undefined;

export function toDate(value: DateValue): Date | null {
  if (!value) return null;

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return new Date(value);
}

// 10 Jul 2026 07:00:00
export function formatDateTime(value: DateValue) {
  const date = toDate(value);

  if (!date) return "-";

  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return `${datePart} ${timePart}`;
}

// Friday, 10 July 2026
export function formatDateFull(value: DateValue) {
  const date = toDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateDayMonthYear(value: DateValue) {
  const date = toDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateDayMonth(value: DateValue) {
  const date = toDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
  });
}

export function formatDateYear(value: DateValue) {
  const date = toDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("en-GB", {
    year: "numeric",
  });
}

export function formatDateMonth(value: DateValue) {
  const date = toDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("en-GB", {
    month: "long",
  });
}

export function formatDateDay(value: DateValue) {
  const date = toDate(value);

  if (!date) return "-";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

export function formatDateInput(date: DateValue = new Date()) {
  const d = toDate(date);

  if (!d) return "";

  return d.toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });
}

export function normalizeDate(value: DateValue): string {

  if (!value) return "";

  let date: Date;


  if (typeof value === "string") {
    date = new Date(value);
  }
  else if (value instanceof Date) {
    date = value;
  }
  else {
    date = value.toDate();
  }


  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");


  return `${year}-${month}-${day}`;
}

export function formatDateMonthRange(value: DateValue) {
  const date = toDate(value);

  if (!date) return "-";

  const currentMonth = date.toLocaleDateString("en-GB", {
    month: "long",
  });

  const next = new Date(date);

  next.setMonth(next.getMonth() + 1);

  const nextMonth = next.toLocaleDateString("en-GB", {
    month: "long",
  });

  return `${currentMonth} - ${nextMonth}`;
}

// ----------------------------------------------------------------------------
// NOMINAL
// ----------------------------------------------------------------------------

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
