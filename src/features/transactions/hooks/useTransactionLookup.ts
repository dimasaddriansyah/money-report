import { useMemo } from "react";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";

type Props = {
  accounts: Account[];
  categories: Category[];
};

export function useTransactionLookup({ accounts, categories }: Props) {
  const accountLookup = useMemo(
    () => Object.fromEntries(accounts.map((row) => [row.id, row.name])),
    [accounts],
  );

  const categoryLookup = useMemo(
    () => Object.fromEntries(categories.map((row) => [row.id, row.name])),
    [categories],
  );

  return {
    accountLookup,
    categoryLookup,
  };
}
