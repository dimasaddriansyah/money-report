import { useMemo, useState } from "react";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import type { Transaction } from "../types/transaction";
import { isDateMatch, type DateFilter } from "../../../shared/utils/dateFilter.helper";
import { createLookup } from "../../../shared/utils/lookup.helper";
import {
  getAccountDisplay,
  getCategoryName,
} from "../utils/ui.helpers";

interface Props {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
}

export function useTransactionFilter({
  transactions,
  accounts,
  categories,
}: Props) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateFilter>(null);
  const [search, setSearch] = useState("");

  const accountLookup = useMemo(
    () => createLookup(accounts),
    [accounts]
  );

  const categoryLookup = useMemo(
    () => createLookup(categories),
    [categories]
  );

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return transactions.filter((trx) => {
      const accountNames = getAccountDisplay(trx, accountLookup);
      const categoryName = getCategoryName(trx.categoryId, categoryLookup);

      const matchAccount =
        !selectedAccount || accountNames.includes(selectedAccount);

      const matchCategory =
        !selectedCategory || categoryName === selectedCategory;

      const matchSearch =
        !keyword ||
        (trx.remark ?? "").toLowerCase().includes(keyword);

      const matchDate =
        isDateMatch(trx.date, selectedDate);

      return (
        matchAccount &&
        matchCategory &&
        matchSearch &&
        matchDate
      );
    });
  }, [
    transactions,
    accountLookup,
    categoryLookup,
    selectedAccount,
    selectedCategory,
    selectedDate,
    search,
  ]);

  return {
    filteredTransactions,
    accountLookup,
    categoryLookup,
    search,
    setSearch,
    selectedDate,
    setSelectedDate,
    selectedAccount,
    setSelectedAccount,
    selectedCategory,
    setSelectedCategory,
  };
}