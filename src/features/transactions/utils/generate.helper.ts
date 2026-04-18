import { accountAlias, categoryAlias } from "../../../shared/utils/alias.helper";
import { parseSmartNominal } from "../../../shared/utils/format.helper";

export function parseTransactionInput(input: string) {
  const words = input.toLowerCase().trim().split(/\s+/);

  let nominal = 0;
  let account = "";
  let category = "";
  let typeId = "TP002";
  let date = new Date().toISOString().split("T")[0];

  const cleanWords: string[] = [];

  for (const word of words) {
    // TYPE
    if (word === "income") {
      typeId = "TP001";
      continue;
    }

    if (word === "transfer") {
      typeId = "TP003";
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
    typeId,
    account,
    category,
  };
}
