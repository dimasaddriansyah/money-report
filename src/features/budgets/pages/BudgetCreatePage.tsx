import { useNavigate } from "react-router-dom";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { toast } from "sonner";
import BudgetLayout from "../components/BudgetLayout";
import BudgetForm from "../components/BudgetForm";

export default function BudgetCreatePage() {
  const navigate = useNavigate();
  const { saveBudget, loading } = useBudgetActions();

  async function handleSubmit(data: { 
    id?: string;
    date: string;
    accountId?: string;
    amount: number;
    remark: string;
   }) {
    try {
      const result = await saveBudget(data);
      navigate("/budgets")
      toast.success("Success", {
        description: result.message
      });
    } catch (error: any) {
      toast.error("Failed to save budget", {
        description: error.message,
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
            { label: "Dashboard", path: "/" },
            { label: "Budgets", path: "/budgets" },
            { label: "Create Budget" },
          ]}
          showBack
        >
          <BudgetForm onSubmit={handleSubmit} loading={loading} />
        </BudgetLayout>
      </div>

      <div className="md:hidden">
        <BudgetForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}