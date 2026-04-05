import type { Transactions } from "../types/Transactions";
import { ACCOUNT_GROUPS, ACCOUNT_STYLES } from "./Alias";

export const getCategoriesImg = (category: string) => {
  const categoryImages = import.meta.glob("../assets/categories/*.png", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const categoryMap: Record<string, string> = {
    Interest: "Saving",
    Cashback: "Saving",
    Bonus: "Payroll",
  };

  const filterCategory = categoryMap[category] ?? category;

  const path = `../assets/categories/${filterCategory}.png`;

  return (
    categoryImages[path] ?? categoryImages["../assets/categories/default.png"]
  );
};

export const getAccountsImg = (account: string) => {
  const accountImages = import.meta.glob("../assets/accounts/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  if (account === "All Account") {
    return accountImages["../assets/accounts/Default.webp"];
  }

  const accountMap: Record<string, string> = {
    Investment: "Jago",
    Subscription: "Jago",
  };

  const filterAccount = accountMap[account] ?? account;

  const path = `../assets/accounts/${filterAccount}.webp`;

  return (
    accountImages[path] ?? accountImages["../assets/accounts/Default.webp"]
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
  trx: Transactions,
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

export const getProgressStyles = (value: number) => {
  if (value >= 90)
    return {
      bar: "bg-red-500",
      badge: "bg-red-50 text-red-500",
      text: "text-red-500",
    };

  if (value >= 60)
    return {
      bar: "bg-amber-500",
      badge: "bg-amber-50 text-amber-500",
      text: "text-amber-500",
    };

  return {
    bar: "bg-blue-500",
    badge: "bg-blue-50 text-blue-500",
    text: "text-blue-500",
  };
};

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}
