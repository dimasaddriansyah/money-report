import BudgetDesktop from "../components/BudgetDesktop";
import BudgetLayout from "../components/BudgetLayout";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import BudgetMobile from "../components/BudgetMobile";
import { useBudgets } from "../hooks/useBudgets";

export default function BudgetPage() {
  const { budgets, loading, refetch } = useBudgets();
  const { accounts } = useAccounts();
  const { transactions } = useTransactions();

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading budgets...
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <section className="flex flex-col flex-1 px-6 py-8 gap-6 overflow-y-auto">
          <BudgetDesktop budgets={budgets} accounts={accounts} transactions={transactions} refetch={refetch} />
        </section>
      </div>

      <div className="md:hidden">
        <BudgetMobile budgets={budgets} accounts={accounts} transactions={transactions} refetch={refetch} />
      </div>
    </>
  );
}