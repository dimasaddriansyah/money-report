// -----------------------------------------------------------------------------
// DATE UTILITIES
// -----------------------------------------------------------------------------
export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// ----------------------------------------------------------------------------
// FORMAT ISO → INDONESIA (Display Only)
// ----------------------------------------------------------------------------
export function formatISODatetoID(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
}

// ----------------------------------------------------------------------------
// EXTRACT SMART DATE FROM TEXT
// ----------------------------------------------------------------------------
export function extractShortDate(text: string): string | null {
  const lower = text.toLowerCase();
  const today = new Date();
  const year = today.getFullYear();

  const toISO = (d: Date) => d.toISOString().split("T")[0];

  // ============================
  // 1️⃣ Relative (kemarin, dll)
  // ============================
  if (lower.includes("kemarin")) {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return toISO(d);
  }

  if (lower.includes("hari ini")) {
    return toISO(today);
  }

  if (lower.includes("besok")) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return toISO(d);
  }

  // ============================
  // 2️⃣ Text month (10 jan / 10-jan / 10/jan)
  // ============================
  const textMonthMatch = lower.match(
    /\b(0?[1-9]|[12][0-9]|3[01])[\s/-](jan|januari|feb|februari|mar|maret|apr|april|mei|jun|juni|jul|juli|agu|agustus|sep|september|okt|oktober|nov|november|des|desember)\b/,
  );

  if (textMonthMatch) {
    const day = textMonthMatch[1].padStart(2, "0");
    const monthName = textMonthMatch[2];

    const MONTH_MAP: Record<string, string> = {
      jan: "01",
      januari: "01",
      feb: "02",
      februari: "02",
      mar: "03",
      maret: "03",
      apr: "04",
      april: "04",
      mei: "05",
      jun: "06",
      juni: "06",
      jul: "07",
      juli: "07",
      agu: "08",
      agustus: "08",
      sep: "09",
      september: "09",
      okt: "10",
      oktober: "10",
      nov: "11",
      november: "11",
      des: "12",
      desember: "12",
    };

    const month = MONTH_MAP[monthName];
    if (month) {
      return `${year}-${month}-${day}`;
    }
  }

  // ============================
  // 3️⃣ Numeric (10-01 / 10/01)
  // ============================
  const numericMatch = lower.match(
    /\b(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[0-2])\b/,
  );

  if (numericMatch) {
    const day = numericMatch[1].padStart(2, "0");
    const month = numericMatch[2].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return null;
}

// ----------------------------------------------------------------------------
// TODAY ISO
// ----------------------------------------------------------------------------
export const getTodayISO = () => new Date().toLocaleDateString("sv-SE");

// ----------------------------------------------------------------------------
// FORMAT DATE YYYY-MM -> Februari 2026
// ----------------------------------------------------------------------------
export const formatMonthYear = (value: string): string => {
  const [year, month] = value.split("-");
  const monthName = MONTHS[parseInt(month, 10) - 1];
  return `${monthName} ${year}`;
};

// -------------------------------------------------------------------------------
// RUPIAH FORMAT
// -------------------------------------------------------------------------------
export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export const formatRupiahInput = (value: number | string) => {
  const numeric =
    typeof value === "number"
      ? value
      : Number(value.toString().replace(/\D/g, ""));

  if (!numeric) return "";

  return new Intl.NumberFormat("id-ID").format(numeric);
};

export const formatNumber = (value: number) => {
  return value.toLocaleString("id-ID");
};

// -------------------------------------------------------------------------------
// SMART CAPITALIZE
// -------------------------------------------------------------------------------
const LOWERCASE_WORDS = [
  "dari",
  "ke",
  "dan",
  "di",
  "yang",
];

export const smartCapitalize = (text: string): string => {
  if (!text) return "";

  const words = text.trim().split(/\s+/);

  return words
    .map((word, index) => {
      const lowerWord = word.toLowerCase();

      if (word.length >= 2 && word === word.toUpperCase()) {
        return word;
      }

      if (LOWERCASE_WORDS.includes(lowerWord) && index !== 0) {
        return lowerWord;
      }

      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join(" ");
};
