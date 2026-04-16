import { useCallback, useEffect, useState } from "react";
import type { Transaction } from "../types/transaction";
import { fetchTransactions } from "../services/TransactionService";

export function useTransactions(initialPage: number = 1, initialLimit: number = 10) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit); 
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async (currentPage: number) => {
    try {
      setLoading(true);
      const result = await fetchTransactions(currentPage, limit);
      setTransactions(result.data);
      setMeta(result.meta);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load transactions");
      }
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadTransactions(page);
  }, [page, limit, loadTransactions]);

  function nextPage() {
    if (page < meta.totalPages) {
      setPage(prev => prev + 1);
    }
  }

  function prevPage() {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }

  return {
    transactions,
    loading,
    error,
    page,
    meta,
    nextPage,
    prevPage,
    setPage,
    limit,
    setLimit,
    refetch: () => loadTransactions(page),
  };
}