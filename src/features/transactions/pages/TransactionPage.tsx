import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";
import TransactionDesktop from "../components/TransactionDesktop";
import TransactionLayout from "../components/TransactionLayout";
import TransactionMobile from "../components/TransactionMobile";
import { useTransactions } from "../hooks/useTransactions";

export default function TransactionPage() {
  const { transactions, loading, refetch } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading transactions...
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <TransactionLayout
          title="List of Transaction"
          breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Transactions" }]}
          button={{ label: "Create Transaction", url: "/transaction/create" }}
        >
          <TransactionDesktop
            transactions={transactions}
            accounts={accounts}
            categories={categories}
            refetch={refetch} />
        </TransactionLayout>
      </div>

      <div className="md:hidden">
        <TransactionMobile
          transactions={transactions}
          accounts={accounts}
          categories={categories}
          refetch={refetch} />
      </div>
    </>
  );
}