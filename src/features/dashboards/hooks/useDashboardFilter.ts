import { useMemo, useState } from "react";
import type { Transaction } from "../../transactions/types/transaction";
import { isDateInPeriod } from "../utils/period.helper";
import { toDate } from "../../../shared/utils/format.helper";

export type Period =
  | "year"
  | "month"
  | "week"
  | "yesterday"
  | "today";

type Props = {
  transactions: Transaction[];
};

export function useDashboardFilter({ transactions }: Props) {
  const [period, setPeriod] = useState<Period>("month");
  const [selectedMonth] = useState(() => new Date());

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((trx) => {
      const trxDate = toDate(trx.date);

      if (!trxDate) return false;

      const matchPeriod = isDateInPeriod(
        trxDate,
        period,
        selectedMonth
      );

      const matchAccount =
        !selectedAccount ||
        trx.fromAccountId === selectedAccount;

      const matchCategory =
        !selectedCategory ||
        trx.categoryId === selectedCategory;

      return (
        matchPeriod &&
        matchAccount &&
        matchCategory
      );
    });
  }, [
    transactions,
    period,
    selectedMonth,
    selectedAccount,
    selectedCategory,
  ]);

  return {
    period,
    setPeriod,
    selectedAccount,
    setSelectedAccount,
    selectedCategory,
    setSelectedCategory,
    filteredTransactions
  };
}