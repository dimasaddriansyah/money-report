import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useCategories } from "../../categories/hooks/useCategories";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import PortfolioDesktop from "./PortfolioDesktop";
import PortfolioLayout from "./PortfolioLayout";

export default function PortfolioPage() {
  const { transactions, loading, refetch } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading portfolio...</span>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <PortfolioLayout
          title="List of Portfolio"
          breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Portfolios" }]}
          button={{ label: "Create Portfolio", url: "/transaction/create" }}>
          <PortfolioDesktop
            transactions={transactions}
            accounts={accounts}
            categories={categories}
            refetch={refetch} />
        </PortfolioLayout>
      </div>

      {/* <div className="md:hidden">
        <TransactionMobile
          transactions={transactions}
          accounts={accounts}
          categories={categories}
          refetch={refetch} />
      </div> */}
    </>
  );
}