import { useNavigate, useParams } from "react-router-dom";
import TransactionForm from "../components/TransactionForm";
import TransactionLayout from "../components/TransactionLayout";
import { useTransactions } from "../hooks/useTransactions";
import { useTransactionActions } from "../hooks/useTransactionActions";
import { toast } from "sonner";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";

export default function TransactionEditPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { transactions, loading: isFetchingTransactions } = useTransactions();
  const { saveTransaction, loading } = useTransactionActions();
  const transaction = transactions.find((acc) => acc.id === id);
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  async function handleSubmit(data: {
    id?: string;
    type: string;
    date: string;
    fromAccountId?: string;
    toAccountId?: string;
    categoryId?: string;
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

  if (isFetchingTransactions) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading transactions...
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
          showBack
        >
          <TransactionForm defaultValues={transaction} accounts={accounts} categories={categories} onSubmit={handleSubmit} loading={loading} />
        </TransactionLayout>
      </div>

      <div className="md:hidden">
        <TransactionForm defaultValues={transaction} accounts={accounts} categories={categories} onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}