import type { TransactionType } from "../types/Transactions";
import { categoryAlias, accountAlias } from "./Alias";
import { parseSmartNominal } from "./Number";

export function parseTransactionInput(input: string) {
  const words = input.toLowerCase().trim().split(/\s+/);

  let nominal = 0;
  let account = "";
  let category = "";
  let type: TransactionType = "expenses";
  let date = new Date().toISOString().split("T")[0];

  const cleanWords: string[] = [];

  for (const word of words) {
    // TYPE
    if (word === "income") {
      type = "income";
      continue;
    }

    if (word === "transfer") {
      type = "transfer";
      continue;
    }

    // DATE DETECTION (dd/mm or dd-mm)
    const dateMatch = word.match(/^(\d{1,2})[/-](\d{1,2})$/);
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, "0");
      const month = dateMatch[2].padStart(2, "0");
      const year = new Date().getFullYear();

      date = `${year}-${month}-${day}`;
      continue;
    }

    // NOMINAL
    if (/\d/.test(word) && nominal === 0) {
      nominal = parseSmartNominal(word);
      continue;
    }

    // ACCOUNT
    if (accountAlias[word]) {
      account = accountAlias[word];
      continue;
    }

    // CATEGORY
    if (categoryAlias[word]) {
      category = categoryAlias[word];
      continue;
    }

    cleanWords.push(word);
  }

  return {
    remark: cleanWords.join(" "),
    nominal,
    date,
    type,
    account,
    category,
  };
}
