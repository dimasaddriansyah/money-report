import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import type { Transaction } from "../../transactions/types/transaction";
import { useAccountBalances } from "./useAccountBalances";
import { useDailyExpenseData } from "./useDailyExpenseData";
import { useSummaryData } from "./useSummaryData";
import { useTopExpenseData } from "./useTopExpenseData";

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  refetch: () => void;
}

export function useDashboardData({ transactions, accounts, categories, refetch }: Props) {
  const summary = useSummaryData(transactions);
  const accountsWithBalance = useAccountBalances(transactions, accounts);
  const dailyExpense = useDailyExpenseData(transactions);
  const topExpenses = useTopExpenseData(transactions);

  return {
    refetch,
    transactions,
    accounts,
    categories,
    summary,
    accountsWithBalance,
    dailyExpense,
    topExpenses,
  };
}