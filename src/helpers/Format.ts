// -------------------------------------------------------------------------------
// FORMAT DATE, PERIOD RANGE DATE, TODAY, EXTRACT DATE STRING
// -------------------------------------------------------------------------------
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

const MONTH_MAP: Record<string, string> = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07",
  Agustus: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const getPeriodRange = (monthIndex: number, year: number) => {
  const start = new Date(year, monthIndex - 1, 25, 0, 0, 0);
  const end = new Date(year, monthIndex, 24, 23, 59, 59);
  return { start, end };
};

export const getTodayISO = () => {
  return new Date().toISOString().split("T")[0];
};

export const extractDateFromText = (text: string): string | null => {
  const match = text.match(/^(\d{1,2})[/-](\d{1,2})$/);

  if (!match) return null;

  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  const year = new Date().getFullYear();

  return `${year}-${month}-${day}`;
};

export function convertToISO(dateStr: string): string {
  const [day, monthName, year] = dateStr.trim().split(" ");

  const month = MONTH_MAP[monthName];

  return `${year}-${month}-${day.padStart(2, "0")}`;
}

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

// -------------------------------------------------------------------------------
// SMART CAPITALIZE
// -------------------------------------------------------------------------------
const LOWERCASE_WORDS = [
  "dari",
  "ke",
  "dan",
  "di",
  "yang",
  "from",
  "to",
  "of",
  "and",
];

export const smartCapitalize = (text: string): string => {
  if (!text) return "";

  const words = text.trim().split(/\s+/);

  return words
    .map((word, index) => {
      const lowerWord = word.toLowerCase();

      if (word === word.toUpperCase()) {
        return word;
      }

      if (LOWERCASE_WORDS.includes(lowerWord) && index !== 0) {
        return lowerWord;
      }

      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join(" ");
};
