import { useEffect, useState } from "react";
import type { Account } from "../types/account";
import { fetchAccounts } from "../services/AccountService";

export function useAccounts(initialPage: number = 1, limit: number = 10) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [page, setPage] = useState(initialPage);
  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAccounts(currentPage: number) {
    try {
      setLoading(true);
      const result = await fetchAccounts(currentPage, limit);
      setAccounts(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts(page);
  }, [page]);

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
    accounts,
    loading,
    error,
    page,
    meta,
    nextPage,
    prevPage,
    setPage,
    refetch: () => loadAccounts(page),
  };
}