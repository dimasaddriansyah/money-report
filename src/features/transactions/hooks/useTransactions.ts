import { useEffect, useState } from "react";
import type { Transaction } from "../types/transaction";
import { fetchTransactions } from "../services/TransactionService";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await fetchTransactions();
      const sorted = data.sort((a, b) => b.id.localeCompare(a.id));
      setTransactions(sorted);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch: loadTransactions,
  };
}