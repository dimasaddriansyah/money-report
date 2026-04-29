import { useNavigate, useParams } from "react-router-dom";
import { useBudgets } from "../hooks/useBudgets";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { toast } from "sonner";
import BudgetLayout from "../components/BudgetLayout";
import BudgetForm from "../components/BudgetForm";
import { useAccounts } from "../../accounts/hooks/useAccounts";

export default function BudgetEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { budgets, loading: isFetchingBudgets } = useBudgets();
  const { accounts} = useAccounts();
  const { saveBudget, loading } = useBudgetActions();
  const budget = budgets.find((acc) => acc.id === id);

  async function handleSubmit(data: {
    id?: string;
    date: string;
    accountId?: string;
    remark: string;
    amount: number;
  }) {
    try {
      const result = await saveBudget(data);
      navigate("/budgets")
      toast.success("Success", {
        description: result.message,
      });
    } catch (error: unknown) {
      let message = "Failed to save account";
      if (error instanceof Error) { message = error.message }
      toast.error("Failed to save account", {
        description: message,
        duration: 2000,
      });
    }
  }

  if (isFetchingBudgets) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading budgets...
      </div>
    );
  }

  if (!budget && budgets.length > 0) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Budget not found
      </div>
    );
  }

  if (!budget) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block">
        <BudgetLayout 
          title="Form Edit Budget"
          breadcrumb={[
            { label: "Dashboard", path: "/" },
            { label: "Budgets", path: "/budgets" },
            { label: "Edit Budget" },
          ]}
          showBack>
          <BudgetForm defaultValues={budget} accounts={accounts} onSubmit={handleSubmit} loading={loading} />
        </BudgetLayout>
      </div>

      <div className="md:hidden">
        {/* <BudgetForm defaultValues={budget} onSubmit={handleSubmit} loading={loading} /> */}
      </div>
    </>
  );
}