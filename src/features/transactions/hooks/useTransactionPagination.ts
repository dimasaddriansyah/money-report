import { useMemo } from "react";
import type { Transaction } from "../types/transaction";

type Props = {
  transactions: Transaction[];
  page: number;
  limit: number;
};

export function useTransactionPagination({ transactions, page, limit }: Props) {
  const totalItems = transactions.length;

  const totalPages = Math.ceil(totalItems / limit);

  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, totalItems);

  const pages = useMemo(() => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      } else if (i === page - delta - 1 || i === page + delta + 1) {
        range.push("...");
      }
    }

    return range;
  }, [page, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * limit;

    return transactions.slice(start, start + limit);
  }, [transactions, page, limit]);

  return {
    paginatedTransactions,
    totalItems,
    totalPages,
    startItem,
    endItem,
    pages,
  };
}
