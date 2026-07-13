import { useNavigate } from "react-router-dom";
import { useTransactionActions } from "../hooks/useTransactionActions";
import { toast } from "sonner";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";
import type { FormData } from "../utils/transaction.form.helper";
import TransactionLayout from "../components/dekstop/TransactionLayout";
import TransactionForm from "../components/dekstop/TransactionForm";
import TransactionFormMobile from "../components/TransactionFormMobile";

export default function TransactionCreatePage() {
  const navigate = useNavigate();

  const { createTransaction, loading } = useTransactionActions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  async function handleSubmit(data: FormData) {
    try {
      const result = await createTransaction(data);
      navigate("/transactions");
      toast.success("Success", {
        description: result.message,
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

  return (
    <>
      <div className="hidden md:block">
        <TransactionLayout
          title="Form Create Transaction"
          breadcrumb={[
            { label: "Dashboard", path: "/" },
            { label: "Transactions", path: "/transactions" },
            { label: "Create Transaction" },
          ]}
          showBack>
          <TransactionForm
            onSubmit={handleSubmit}
            accounts={accounts}
            categories={categories}
            loading={loading} />
        </TransactionLayout>
      </div>

      <div className="md:hidden">
        <TransactionFormMobile
          onSubmit={handleSubmit}
          accounts={accounts}
          categories={categories}
          loading={loading} />
      </div>
    </>
  );
}
