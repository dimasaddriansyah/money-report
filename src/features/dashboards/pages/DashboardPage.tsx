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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading transaction...</span>
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
        {/* <DashboardMobile
          transactions={transactions}
          accounts={accounts}
          categories={categories}
          refetch={refetch} /> */}
      </div>
    </>
  );
}