import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import DashboardDesktop from "../components/DashboardDesktop";
import DashboardMobile from "../components/DashboardMobile";

export default function DashboardPage() {
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
        <DashboardDesktop
          transactions={transactions}
          accounts={accounts}
          categories={categories}
          refetch={refetch} />
      </div>

      <div className="md:hidden">
        <DashboardMobile
          transactions={transactions}
          accounts={accounts}
          categories={categories}
          refetch={refetch} />
      </div>
    </>
  );
}