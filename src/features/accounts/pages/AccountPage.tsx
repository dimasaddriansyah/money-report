import AccountDesktop from "../components/AccountDesktop";
import AccountLayout from "../components/AccountLayout";
import AccountMobile from "../components/AccountMobile";
import { useAccounts } from "../hooks/useAccounts";

export default function AccountPage() {
  const { accounts, loading, refetch } = useAccounts();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading accounts...</span>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <AccountLayout
          title="List of Account"
          breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Accounts" }]}
          button={{ label: "Create Account", url: "/account/create" }}>
          <AccountDesktop
            accounts={accounts}
            refetch={refetch} />
        </AccountLayout>
      </div>

      <div className="md:hidden">
        <AccountMobile
          accounts={accounts}
          refetch={refetch} />
      </div>
    </>
  );
}