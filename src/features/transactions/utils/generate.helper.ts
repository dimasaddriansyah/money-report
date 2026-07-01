export type TransactionType = "expense" | "income" | "transfer";

export type ParsedTransaction = {
  raw: string;
  type: TransactionType;
  category: string;
  amount: number;
  fromAccount: string;
  toAccount: string;
  date: string;
  remark: string;
};

// ==========================================================================================
// RULES
// ==========================================================================================

const ACCOUNT_RULES: Record<string, string[]> = {
  BCA: ["bca"],
  "Blu by BCA": ["blu"],
  Mandiri: ["mandiri"],
  Seabank: ["seabank"],
  Gopay: ["gopay"],
  Jago: ["jago"],
  "e-Money Mandiri": ["emoney", "e-money"],
  "TapCash BNI": ["tapcash"],
  Bibit: ["bibit"],
  Investment: ["investment"],
  "CIMB Niaga": ["cimb"],
  Transportation: ["transportation"],
};

const CATEGORY_RULES: Record<string, string[]> = {
  "Foods and Beverages": ["fnb", "kopi", "warung", "makan", "foodcourt", "cafe", "ayam"],
  Grocery: ["grocery", "indomaret", "alfamidi", "alfamart"],
  "Top Up": ["top up"],
  Gasoline: ["gas", "gasoline"],
  Transportation: ["transport", "transportation"],
  Parking: ["parking", "parkir"],
  Gallon: ["gallon"],
  Laundry: ["laundry"],
  Investment: ["investment", "invest"],
  "Self Rewards": ["self"],
  Service: ["service"],
  Saving: ["saving", "save"],
  Subscription: ["subscription", "subs"],
  Others: ["others"],
  Payroll: ["payroll"],
  Bonus: ["bonus"],
  Cashback: ["cashback"],
  Interest: ["interest", "bunga"],
  "Transfer In": ["tfin", "masuk"],
  "Transfer Out": ["tfout", "keluar"],
  "Internal Transfer": ["itf"],
};

const REMARK_CATEGORY_EXCEPTIONS = ["kopi", "warung", "foodcourt", "indomaret", "ayam", "cafe", "payroll", "parkir", "top up"];

// ==========================================================================================
// TYPE
// ==========================================================================================

function detectType(text: string): TransactionType {
  const lower = text.toLowerCase();

  if (
    lower.includes("income") ||
    lower.includes("cashback") ||
    lower.includes("payroll")
  ) {
    return "income";
  }

  if (
    lower.includes("transfer") ||
    lower.includes("ke ") ||
    lower.includes("dari ")
  ) {
    return "transfer";
  }

  return "expense";
}

// ==========================================================================================
// CATEGORY
// ==========================================================================================

function detectCategory(text: string): string {
  const lower = text.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some((k) => lower.includes(k))) {
      return category;
    }
  }

  return "";
}

// ==========================================================================================
// AMOUNT
// ==========================================================================================

function detectAmountMatch(text: string) {
  const lower = text.toLowerCase();

  const match = lower.match(
    /(\d+(?:\.\d+)?)\s*(jt|juta|k|rb|ribu)?/
  );

  if (!match) return null;

  const num = Number(match[1]);
  const suffix = match[2];

  let value = 0;

  switch (suffix) {
    case "jt":
    case "juta":
      value = num * 1_000_000;
      break;
    case "k":
    case "rb":
    case "ribu":
      value = num * 1_000;
      break;
    default:
      value = num;
  }

  return {
    value,
    index: match.index ?? -1,
    raw: match[0],
  };
}

// ==========================================================================================
// ACCOUNT
// ==========================================================================================

function findAccount(text: string): string {
  const lower = text.toLowerCase();

  for (const [account, keywords] of Object.entries(ACCOUNT_RULES)) {
    if (keywords.some((k) => lower.includes(k))) {
      return account;
    }
  }

  return "";
}

function detectAccounts(text: string, type: TransactionType) {
  const lower = text.toLowerCase();

  if (type === "transfer") {
    let fromAccount = "";
    let toAccount = "";

    for (const [account, keywords] of Object.entries(ACCOUNT_RULES)) {
      for (const k of keywords) {
        if (lower.includes(`dari ${k}`) || lower.includes(`from ${k}`)) {
          fromAccount = account;
        }
        if (lower.includes(`ke ${k}`) || lower.includes(`to ${k}`)) {
          toAccount = account;
        }
      }
    }

    return { fromAccount, toAccount };
  }

  if (type === "income") {
    return {
      fromAccount: "",
      toAccount: findAccount(text),
    };
  }

  return {
    fromAccount: findAccount(text),
    toAccount: "",
  };
}

// ==========================================================================================
// DATE
// ==========================================================================================

function detectDate(text: string): string {
  const lower = text.toLowerCase();
  const year = new Date().getFullYear();

  if (lower.includes("kemarin")) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }

  const monthMap: Record<string, number> = {
    jan: 1,
    january: 1,
    feb: 2,
    february: 2,
    mar: 3,
    march: 3,
    apr: 4,
    april: 4,
    mei: 5,
    may: 5,
    jun: 6,
    june: 6,
    jul: 7,
    july: 7,
    aug: 8,
    august: 8,
    sep: 9,
    september: 9,
    oct: 10,
    october: 10,
    nov: 11,
    november: 11,
    dec: 12,
    december: 12,
  };

  const match = lower.match(/(\d{1,2})\s+([a-zA-Z]+)/);

  if (match) {
    const day = Number(match[1]);
    const month = monthMap[match[2].toLowerCase()];

    if (month) {
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    }
  }

  return new Date().toISOString().split("T")[0];
}

// ==========================================================================================
// CLEAN REMARK
// ==========================================================================================

function cleanRemark(
  text: string,
  amountMatch: ReturnType<typeof detectAmountMatch>
): string {
  let remark = text; // 👈 JANGAN lowercase

  const lower = text.toLowerCase();

  const amountRaw = amountMatch?.raw ?? "";
  const amountIndex = amountMatch?.index ?? -1;

  // ==========================
  // 1. remove amount
  // ==========================
  remark = remark.replace(new RegExp(amountRaw, "gi"), "");

  // ==========================
  // 2. remove generic words
  // ==========================
  remark = remark.replace(
    /\b(pakai|via|ke|dari|transfer|income|expense)\b/gi,
    ""
  );

  // ==========================
  // 3. remove category keywords
  // ==========================
  for (const keywords of Object.values(CATEGORY_RULES)) {
    for (const k of keywords) {
      if (REMARK_CATEGORY_EXCEPTIONS.includes(k)) continue;

      const regex = new RegExp(`\\b${k}\\b`, "gi");
      remark = remark.replace(regex, "");
    }
  }

  // ==========================
  // 4. remove account (only after amount)
  // ==========================
  for (const keywords of Object.values(ACCOUNT_RULES)) {
    for (const k of keywords) {
      const idx = lower.indexOf(k); // pakai lower hanya untuk posisi

      if (amountIndex !== -1 && idx > amountIndex) {
        const regex = new RegExp(`\\b${k}\\b`, "gi");
        remark = remark.replace(regex, "");
      }
    }
  }

  // ==========================
  // 5. cleanup spacing only
  // ==========================
  return remark.replace(/\s+/g, " ").trim();
}

// ==========================================================================================
// PARSER
// ==========================================================================================

export function parseTransaction(text: string): ParsedTransaction {
  const type = detectType(text);
  const amountMatch = detectAmountMatch(text);

  const amount = amountMatch?.value ?? 0;
  const accounts = detectAccounts(text, type);

  return {
    raw: text,
    type,
    category: detectCategory(text),
    amount,
    fromAccount: accounts.fromAccount,
    toAccount: accounts.toAccount,
    date: detectDate(text),
    remark: cleanRemark(text, amountMatch),
  };
}