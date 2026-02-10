import { useEffect, useMemo, useState } from "react";
import { parseNominal, getPeriodRange } from "../helpers/helper";

export type Transaction = {
  transaction_id: string;
  date: string;
  type: string;
  payment: string;
  category: string;
  remark: string;
  nominal: string;
};

export const useTransactions = (
  apiUrl: string,
  selectedMonthIndex: number,
  year: number,
) => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH SEKALI
  useEffect(() => {
    setLoading(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values ?? [];

        const mapped: Transaction[] = rows.map((row: string[]) => ({
          transaction_id: row[0] ?? "",
          date: row[2] ?? "",
          type: row[3] ?? "",
          payment: row[4] ?? "",
          category: row[5] ?? "",
          remark: row[6] ?? "",
          nominal: row[7] ?? "0",
        }));

        mapped.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setAllTransactions(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [apiUrl]);

  // 🔹 FILTER PERIODE 25 → 24
  const periodTransactions = useMemo(() => {
    const { start, end } = getPeriodRange(selectedMonthIndex, year);

    return allTransactions.filter((trx) => {
      if (!trx.date) return false;
      const d = new Date(trx.date);
      return d >= start && d <= end;
    });
  }, [allTransactions, selectedMonthIndex, year]);

  // 🔹 HITUNG BALANCE
  const totalBalances = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};

    allTransactions.forEach((trx) => {
      if (!trx.payment) return;

      const amount = parseNominal(trx.nominal);
      map[trx.payment] ??= 0;

      if (trx.type === "Income") {
        map[trx.payment] += amount;
      } else if (trx.type === "Expenses") {
        map[trx.payment] -= amount;
      }
    });

    return map;
  }, [allTransactions]);

  return {
    loading,
    transactions: periodTransactions,
    balances: totalBalances,
  };
};
