import { useNavigate, useParams } from "react-router-dom";
import { useBudgets } from "../hooks/useBudgets";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { toast } from "sonner";
import BudgetLayout from "../components/BudgetLayout";
import BudgetForm from "../components/BudgetForm";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useState } from "react";
import Modal from "../../../shared/ui/Modal";
import { Delete02Icon } from "hugeicons-react";
// import BudgetFormMobile from "../components/BudgetFormMobile";
import type { FormData } from "../utils/budget.form.helper";

export default function BudgetEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { budgets, loading: isFetchingBudgets } = useBudgets();
  const { accounts } = useAccounts();
  const { updateBudget, deleteBudget, loading } = useBudgetActions();
  const budget = budgets.find((acc) => acc.id === id);

  const [openDelete, setOpenDelete] = useState(false);

  async function handleSubmit(data: FormData) {
    try {
      const result = await updateBudget(data);
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

  async function handleDelete() {
    if (!budget) return;

    try {
      const result = await deleteBudget(budget.id);

      toast.success("Deleted", {
        description: result.message,
      });

      navigate("/budgets");
    } catch (error: unknown) {
      let message = "Failed to delete budget";

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error("Failed to delete", {
        description: message,
      });
    }
  }

  if (isFetchingBudgets) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading budgets...</span>
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
            { label: "Dashboard", path: "/dashboard" },
            { label: "Budgets", path: "/budgets" },
            { label: "Edit Budget" },
          ]}
          showBack
          action={
            <button
              onClick={() => setOpenDelete(true)}
              className="flex items-center px-4 py-2.5 gap-2 border border-red-500 hover:bg-red-500 text-red-500 hover:text-white text-sm font-medium rounded-lg transition cursor-pointer">
              <Delete02Icon size={16} />
              <span>Delete Budget</span>
            </button>
          }>
          <BudgetForm defaultValues={budget} accounts={accounts} onSubmit={handleSubmit} loading={loading} />
        </BudgetLayout>
        {openDelete && (
          <Modal
            title="Delete Budget"
            textButton="Delete"
            loading={loading}
            onSubmit={handleDelete}
            onClose={() => setOpenDelete(false)}
          >
            <p className="p-4 text-sm text-slate-500">
              Delete{" "}
              <span className="text-black font-semibold">
                "{budget.remark}"
              </span>
              ? This cannot be undone.
            </p>
          </Modal>
        )}
      </div>

      <div className="md:hidden">
        {/* <BudgetFormMobile defaultValues={budget} accounts={accounts} onSubmit={handleSubmit} loading={loading} /> */}
      </div>
    </>
  );
}