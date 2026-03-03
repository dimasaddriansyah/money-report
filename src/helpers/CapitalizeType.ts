import type { TransactionType } from "../types/Transactions";

export const CapitalizeType = (type: TransactionType): string => {
  switch (type) {
    case "income":
      return "Income";
    case "expenses":
      return "Expenses";
    case "transfer":
      return "Transfer";
    default:
      return type;
  }
};
