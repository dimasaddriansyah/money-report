import { useNavigate } from "react-router-dom";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { toast } from "sonner";
import BudgetLayout from "../components/BudgetLayout";
import BudgetForm from "../components/BudgetForm";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import BudgetFormMobile from "../components/BudgetFormMobile";
import type { FormData } from "../utils/budget.form.helper";

export default function BudgetCreatePage() {
  const navigate = useNavigate();
  const { createBudget, loading } = useBudgetActions();
  const { accounts } = useAccounts();

  async function handleSubmit(data: FormData) {
    try {
      const result = await createBudget(data);
      navigate("/budgets")
      toast.success("Success", {
        description: result.message
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

  return (
    <>
      <div className="hidden md:block">
        <BudgetLayout
          title="Form Create Budget"
          breadcrumb={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Budgets", path: "/budgets" },
            { label: "Create Budget" },
          ]}
          showBack>
          <BudgetForm onSubmit={handleSubmit} accounts={accounts} loading={loading} />
        </BudgetLayout>
      </div>

      <div className="md:hidden">
        <BudgetFormMobile onSubmit={handleSubmit} accounts={accounts} loading={loading} />
      </div>
    </>
  );
}