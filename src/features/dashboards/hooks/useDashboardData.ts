import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import { useAccountBalances } from "./useAccountBalances";
import { useDailyExpenseData } from "./useDailyExpenseData";
import { useSummaryData } from "./useSummaryData";
import { useTopExpenseData } from "./useTopExpenseData";


export function useDashboardData() {
  const { transactions, loading, refetch } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  const summary = useSummaryData(transactions);
  const accountsWithBalance = useAccountBalances(transactions, accounts);
  const dailyExpense = useDailyExpenseData(transactions);
  const topExpenses = useTopExpenseData(transactions);

  return {
    loading,
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