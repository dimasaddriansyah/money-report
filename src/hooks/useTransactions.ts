import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "../types/Transactions";
import { calculateBalance } from "../helpers/CalculateBalance";
import { fetchTransactions } from "../services/TransactionServices";

export function useTransactions(startDate?: Date, endDate?: Date) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // FETCH DATA
  // =========================
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (hasLoaded) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchTransactions();
        setTransactions(data);
        setHasLoaded(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [hasLoaded]);

  // =========================
  // FILTER BY MONTH
  // =========================
  const filteredTransactions = useMemo(() => {
    if (!startDate || !endDate) return transactions;

    return transactions.filter((trx) => {
      const trxDate = new Date(trx.date);

      return trxDate >= startDate && trxDate <= endDate;
    });
  }, [transactions, startDate, endDate]);

  // =========================
  // CURRENT BALANCE
  // =========================
  const currentBalance = useMemo(() => {
    return calculateBalance(filteredTransactions);
  }, [filteredTransactions]);

  return {
    transactions: filteredTransactions,
    currentBalance,
    loading,
    error,
  };
}
