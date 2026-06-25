import BudgetDesktop from "../components/BudgetDesktop";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import BudgetMobile from "../components/BudgetMobile";
import { useBudgets } from "../hooks/useBudgets";
import Breadcrumb from "../../../shared/ui/Breadcrumb";

export default function BudgetPage() {
  const { budgets, loading, refetch } = useBudgets();
  const { accounts } = useAccounts();
  const { transactions } = useTransactions();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading budgets...</span>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <section className="flex flex-col flex-1 px-6 py-8 gap-6 overflow-y-auto">
          <Breadcrumb items={[{ label: "Dashboard", path: "/" }, { label: "Budgets" }]} />
          <BudgetDesktop budgets={budgets} accounts={accounts} transactions={transactions} refetch={refetch} />
        </section>
      </div>

      <div className="md:hidden">
        <BudgetMobile budgets={budgets} accounts={accounts} transactions={transactions} refetch={refetch} />
      </div>
    </>
  );
}