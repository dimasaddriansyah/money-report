import { useEffect, useMemo, useState, useCallback } from "react";
import type { Transactions } from "../../types/Transactions";
import { calculateNetCashflow } from "../../helpers/CalculateNetCashflow";
import { fetchTransactions } from "../../services/TransactionServices";
import { toast } from "sonner";

const DELETE_URL =
  "https://script.google.com/macros/s/AKfycbzBik6KxU6D4Dt5x5DshCFuR3qn0xhsP2EfheR0oB8uuP6KCOAHgDyc5L7cHa8xKnuj/exec";

export function useTransactions(startDate?: Date, endDate?: Date) {
  const [allTransactions, setAllTransactions] = useState<Transactions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // INITIAL FETCH
  // =========================================================
  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchTransactions();
      setAllTransactions(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // =========================================================
  // REFETCH (OPTIONAL)
  // =========================================================
  const refetch = async () => {
    await loadTransactions();
  };

  // =========================================================
  // DELETE (OPTIMISTIC UPDATE)
  // =========================================================
  const deleteTransaction = async (transactionId: string) => {
    const payload = {
      module: "transactions",
      action: "delete",
      transaction_id: transactionId,
    };

    const previousState = allTransactions;

    setAllTransactions((prev) =>
      prev.filter((t) => t.transaction_id !== transactionId),
    );

    try {
      const response = await fetch(DELETE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status !== "success") {
        setAllTransactions(previousState);
        toast.success("Transaction deleted successfully!", {
          duration: 2000,
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      setAllTransactions(previousState);
      return false;
    }
  };

  // =========================================================
  // PERIOD FILTER (DERIVED STATE)
  // =========================================================
  const periodTransactions = useMemo(() => {
    if (!startDate || !endDate) return allTransactions;

    return allTransactions.filter((trx) => {
      const trxDate = new Date(trx.date);
      return trxDate >= startDate && trxDate <= endDate;
    });
  }, [allTransactions, startDate, endDate]);

  // =========================================================
  // CURRENT BALANCE (DERIVED STATE)
  // =========================================================
  const currentBalance = useMemo(() => {
    return calculateNetCashflow(allTransactions);
  }, [allTransactions]);

  return {
    transactions: periodTransactions, // untuk list period
    allTransactions, // untuk account balances
    currentBalance, // total semua data
    loading,
    error,
    refetch, // optional
    deleteTransaction, // 🔥 clean delete
  };
}
