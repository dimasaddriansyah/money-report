import { useNavigate, useParams } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import { useTransactionActions } from "../hooks/useTransactionActions";
import { toast } from "sonner";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";
import TransactionFormMobile from "../components/TransactionFormMobile";
import type { FormData } from "../utils/transaction.form.helper";
import TransactionLayout from "../components/dekstop/TransactionLayout";
import TransactionForm from "../components/dekstop/TransactionForm";

export default function TransactionEditPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { transactions, loading: isFetchingTransactions } = useTransactions();
  const { updateTransaction, loading } = useTransactionActions();
  const transaction = transactions.find((acc) => acc.id === id);
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  async function handleSubmit(data: FormData) {
    try {
      const result = await updateTransaction(data);
      navigate("/transactions")
      toast.success("Success", {
        description: result.message
      });
    } catch (error: unknown) {
      let message = "Failed to save transaction";
      if (error instanceof Error) { message = error.message }
      toast.error("Failed to save transaction", {
        description: message,
        duration: 2000,
      });
    }
  }

  if (isFetchingTransactions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading transaction...</span>
      </div>
    );
  }

  if (!transaction && transactions.length > 0) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Transaction not found
      </div>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block">
        <TransactionLayout
          title="Form Edit Transaction"
          breadcrumb={[
            { label: "Dashboard", path: "/" },
            { label: "Transactions", path: "/transactions" },
            { label: "Edit Transaction" },
          ]}
          showBack>
          <TransactionForm defaultValues={transaction} accounts={accounts} categories={categories} onSubmit={handleSubmit} loading={loading} />
        </TransactionLayout>
      </div>

      <div className="md:hidden">
        <TransactionFormMobile defaultValues={transaction} accounts={accounts} categories={categories} onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}