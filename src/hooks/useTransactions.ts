import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "../types/Transactions";
import { calculateNetCashflow } from "../helpers/CalculateNetCashflow";
import { fetchTransactions } from "../services/TransactionServices";

export function useTransactions(startDate?: Date, endDate?: Date) {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===========================================================================
  // FETCH DATA (ONLY ONCE)
  // ===========================================================================
  useEffect(() => {
    const load = async () => {
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
    };

    load();
  }, []);

  // ===========================================================================
  // FILTER FOR PERIOD VIEW
  // ===========================================================================
  const periodTransactions = useMemo(() => {
    if (!startDate || !endDate) return allTransactions;

    return allTransactions.filter((trx) => {
      const trxDate = new Date(trx.date);
      return trxDate >= startDate && trxDate <= endDate;
    });
  }, [allTransactions, startDate, endDate]);

  // ===========================================================================
  // CURRENT BALANCE (ALL DATA)
  // ===========================================================================
  const currentBalance = useMemo(() => {
    return calculateNetCashflow(allTransactions);
  }, [allTransactions]);

  return {
    transactions: periodTransactions, // 👈 untuk list & period summary
    allTransactions, // 👈 untuk account balances
    currentBalance, // 👈 snapshot total
    loading,
    error,
  };
}
