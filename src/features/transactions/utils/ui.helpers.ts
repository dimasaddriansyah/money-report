import { formatCurrency } from "../../../shared/utils/format.helper";
import type { Transaction, TransactionType } from "../types/transaction";
import { TRANSACTION_ACCOUNT_CONFIG } from "./transaction.account.config";

export function getAccountDisplay(
  row: Transaction,
  accountMap: Record<string, string>,
): string[] {
  const config = TRANSACTION_ACCOUNT_CONFIG[row.type];

  if (!config) return ["-"];

  return config.fields.map((field) => {
    const id = row[field]?.trim();
    return id ? accountMap[id] ?? id : "-";
  });
}

export function getCategoryName(
  categoryId: string | undefined,
  categoryMap: Record<string, string>
) {
  const id = categoryId?.trim();
  return id ? categoryMap[id] ?? id : "-";
}


export function getTypeDisplay(type: TransactionType) {
  switch (type) {
    case "income":
      return {
        label: "Income",
        className:
          "px-2.5 py-1 bg-green-50 text-green-500 font-medium rounded-full",
      };

    case "expense":
      return {
        label: "Expense",
        className:
          "px-2.5 py-1 bg-red-50 text-red-500 font-medium rounded-full",
      };

    case "transfer":
      return {
        label: "Transfer",
        className:
          "px-2.5 py-1 bg-slate-50 text-slate-500 font-medium rounded-full",
      };

    default:
      return {
        label: type,
        className:
          "px-2.5 py-1 bg-gray-100 text-gray-700 font-medium rounded-full",
      };
  }
}

export function getAmountDisplay(row: Transaction) {
  const formatted = formatCurrency(row.amount);

  switch (row.type) {
    case "income":
      return {
        label: `+ ${formatted}`,
        className: "text-green-500 font-semibold",
      };

    case "expense":
      return {
        label: `- ${formatted}`,
        className: "text-red-500 font-semibold",
      };

    case "transfer":
      return {
        label: formatted,
        className: "text-slate-500 font-semibold",
      };

    default:
      return {
        label: formatted,
        className: "text-gray-500",
      };
  }
}

export function getAccountFields(type: keyof typeof TRANSACTION_ACCOUNT_CONFIG) {
  const config = TRANSACTION_ACCOUNT_CONFIG[type];

  return config.fields.map((field, index) => ({
    key: field,
    label: config.label[index] || field,
  }));
}