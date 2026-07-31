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

  return (
    <>
      <div className="hidden md:block">
        <section className="flex flex-col flex-1 px-6 py-8 gap-6 overflow-y-auto">
          <Breadcrumb items={[{ label: "Dashboard", path: "/dashboard" }, { label: "Budgets" }]} />
          <BudgetDesktop budgets={budgets}
            accounts={accounts}
            transactions={transactions}
            refetch={refetch}
            loading={loading} />
        </section>
      </div>

      <div className="md:hidden">
        <BudgetMobile budgets={budgets}
          accounts={accounts}
          transactions={transactions}
          refetch={refetch}
          loading={loading} />
      </div>
    </>
  );
}