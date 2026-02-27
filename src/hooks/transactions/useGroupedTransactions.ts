import { useMemo } from "react";
import type { Transactions } from "../../types/Transactions";

export function useGroupedTransactions(
  transactions: Transactions[],
  visibleCount: number
) {
  return useMemo(() => {
    const grouped: Record<string, Transactions[]> = {};

    transactions.forEach((trx) => {
      if (!grouped[trx.date]) grouped[trx.date] = [];
      grouped[trx.date].push(trx);
    });

    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const getNumber = (id: string) => Number(id.replace(/\D/g, ""));

    sortedDates.forEach((date) => {
      grouped[date].sort(
        (a, b) => getNumber(b.transaction_id) - getNumber(a.transaction_id)
      );
    });

    const flat = sortedDates.flatMap((date) => grouped[date]);
    const visible = flat.slice(0, visibleCount);

    const visibleGrouped: Record<string, Transactions[]> = {};

    visible.forEach((trx) => {
      if (!visibleGrouped[trx.date]) visibleGrouped[trx.date] = [];
      visibleGrouped[trx.date].push(trx);
    });

    return {
      flatTransactions: flat,
      visibleGrouped,
      visibleDates: Object.keys(visibleGrouped).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      ),
    };
  }, [transactions, visibleCount]);
}
