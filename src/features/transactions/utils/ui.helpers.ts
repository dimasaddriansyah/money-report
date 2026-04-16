import { ArrowDataTransferHorizontalIcon, TradeDownIcon, TradeUpIcon } from "hugeicons-react";
import { formatCurrency } from "../../../shared/utils/format.helper";
import type { Transaction } from "../types/transaction";
import { TRANSACTION_ACCOUNT_CONFIG } from "./transaction.account.config";

const ACCOUNT_STYLE_MAP: Record<string, string[]> = {
  "bg-sky-50 border border-sky-200 text-sky-500": ["gopay"],
  "bg-yellow-50 border border-yellow-200 text-yellow-500": ["jago", "investment"],
  "bg-blue-50 border border-blue-200 text-blue-500": ["bca"],
  "bg-cyan-50 border border-cyan-200 text-cyan-500": ["blu by bca"],
  "bg-amber-50 border border-amber-200 text-amber-500": ["e-money mandiri"],
  "bg-green-50 border border-green-200 text-green-500": ["bibit"],
};

export function getAccountDisplay(
  row: Transaction,
  accountMap: Record<string, string>,
): string[] {
  const config = TRANSACTION_ACCOUNT_CONFIG[row.type as keyof typeof TRANSACTION_ACCOUNT_CONFIG];

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

export function getAccountStyle(name: string): string {
  const key = name.toLowerCase();

  for (const style in ACCOUNT_STYLE_MAP) {
    const keywords = ACCOUNT_STYLE_MAP[style];

    if (keywords.some((k) => key.includes(k))) {
      return style;
    }
  }

  return "bg-slate-100 border border-slate-300 text-slate-700";
}

export function getTypeDisplay(type: string) {
  switch (type) {
    case "TP001":
      return {
        label: "Income",
        className:
          "px-2.5 py-1 bg-green-50 border border-green-200 text-green-500 font-medium rounded-full",
        icon: TradeUpIcon
      };

    case "TP002":
      return {
        label: "Expense",
        className:
          "px-2.5 py-1 bg-red-50 border border-red-200 text-red-500 font-medium rounded-full",
        icon: TradeDownIcon
      };

    case "TP003":
      return {
        label: "Transfer",
        className:
          "px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-500 font-medium rounded-full",
        icon: ArrowDataTransferHorizontalIcon
      };

    default:
      return {
        label: type,
        className:
          "px-2.5 py-1 bg-purple-100 border border-purple-200 text-purple-700 font-medium rounded-full",
        icon: ArrowDataTransferHorizontalIcon
      };
  }
}

export function getAmountDisplay(row: Transaction) {
  const formatted = formatCurrency(row.amount);

  switch (row.type) {
    case "TP001":
      return {
        label: `+ ${formatted}`,
        className: "text-green-500 font-semibold",
      };

    case "TP002":
      return {
        label: `- ${formatted}`,
        className: "text-red-500 font-semibold",
      };

    case "TP003":
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

export function getAccountFields(type: string) {
  const config =
    TRANSACTION_ACCOUNT_CONFIG[
      type as keyof typeof TRANSACTION_ACCOUNT_CONFIG
    ];

  if (!config) return [];

  return config.fields.map((field, index) => ({
    key: field,
    label: config.label[index] || field,
  }));
}

export const TYPE_OPTIONS = [
  { value: "TP001", label: "Income" },
  { value: "TP002", label: "Expense" },
  { value: "TP003", label: "Transfer" },
];