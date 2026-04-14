import { useNavigate } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import TransactionLayout from "../components/TransactionLayout";
import { useTransactionActions } from "../hooks/useTransactionActions";
import { toast } from "sonner";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";

export default function TransactionCreatePage() {
  const navigate = useNavigate();

  const { saveTransaction, loading } = useTransactionActions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  async function handleSubmit(data: {
    id?: string;
    type: string;
    date: string;
    categoryId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    amount: number;
    remark: string;
  }) {
    try {
      const result = await saveTransaction(data);
      navigate("/transactions")
      toast.success("Success", {
        description: result.message
      });
    } catch (error: any) {
      toast.error("Failed to save transaction", {
        description: error.message,
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
          showBack
        >
          <TransactionForm onSubmit={handleSubmit} accounts={accounts} categories={categories} loading={loading} />
        </TransactionLayout>
      </div>

      <div className="md:hidden">
        <TransactionForm onSubmit={handleSubmit} accounts={accounts} categories={categories} loading={loading} />
      </div>
    </>
  );
}