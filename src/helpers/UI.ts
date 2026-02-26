import type { Transaction } from "../types/Transactions";
import { ACCOUNT_GROUPS, ACCOUNT_STYLES } from "./Alias";

export const getCategoriesImg = (category: string) => {
  const categoryImages = import.meta.glob("../assets/categories/*.png", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const path = `../assets/categories/${category}.png`;

  return (
    categoryImages[path] ?? categoryImages["../assets/categories/default.png"]
  );
};

export const getAccountClass = (account?: string) => {
  if (!account) return "bg-slate-100 text-slate-600 border-slate-300";

  const normalized = account.toLowerCase().trim();

  const groupKey = Object.keys(ACCOUNT_GROUPS).find((key) =>
    ACCOUNT_GROUPS[key].includes(normalized),
  );

  if (groupKey) {
    return ACCOUNT_STYLES[groupKey];
  }

  return "bg-slate-100 text-slate-600 border-slate-300";
};

export const getTransactionUtils = (
  trx: Transaction,
  currentAccount?: string,
) => {
  if (trx.type === "income") {
    return {
      sign: "+",
      textColor: "text-green-500",
    };
  }

  if (trx.type === "expenses") {
    return {
      sign: "-",
      textColor: "text-red-500",
    };
  }

  // Transfer
  if (trx.type === "transfer") {
    if (!currentAccount) {
      return {
        sign: "",
        textColor: "text-slate-500",
      };
    }

    if (trx.from_account === currentAccount) {
      return {
        sign: "-",
        textColor: "text-red-500",
      };
    }

    if (trx.to_account === currentAccount) {
      return {
        sign: "+",
        textColor: "text-green-500",
      };
    }

    return {
      sign: "",
      textColor: "text-slate-500",
    };
  }

  return {
    sign: "",
    textColor: "",
  };
};
