import { useMemo, useState } from "react";
import { toDate } from "../../../shared/utils/format.helper";
import type { Transaction } from "../types/transaction";

type Props = {
  transactions: Transaction[];
  start: Date;
  end: Date;
};

export function useTransactionMobileFilter({
  transactions,
  start,
  end,
}: Props) {
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedAccount, setSelectedAccount] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const date = toDate(transaction.date);

      if (!date) return false;

      const matchDate = date >= start && date <= end;

      const matchType =
        selectedType === "ALL" || transaction.typeId === selectedType;

      const matchAccount =
        selectedAccount === "ALL" ||
        transaction.fromAccountId === selectedAccount ||
        transaction.toAccountId === selectedAccount;

      const matchCategory =
        selectedCategory === "ALL" ||
        transaction.categoryId === selectedCategory;

      return matchDate && matchType && matchAccount && matchCategory;
    });
  }, [
    transactions,
    start,
    end,
    selectedType,
    selectedAccount,
    selectedCategory,
  ]);

  return {
    filteredTransactions,

    selectedType,
    setSelectedType,

    selectedAccount,
    setSelectedAccount,

    selectedCategory,
    setSelectedCategory,
  };
}
