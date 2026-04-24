// import BudgetDesktop from "../components/BudgetDesktop";
// import BudgetLayout from "../components/BudgetLayout";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import BudgetMobile from "../components/BudgetMobile";
import { useBudgets } from "../hooks/useBudgets";

export default function BudgetPage() {
  const { budgets, loading, refetch } = useBudgets();
  const { accounts } = useAccounts();

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading budgets...
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        {/* <BudgetLayout
          title="List of Budget"
          breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Budgets" }]}
          button={{ label: "Create Budget", url: "/budget/create" }}
        >
          <BudgetDesktop budgets={budgets} refetch={refetch}/>
        </BudgetLayout> */}
      </div>

      <div className="md:hidden">
        <BudgetMobile budgets={budgets} accounts={accounts} refetch={refetch} />
      </div>
    </>
  );
}