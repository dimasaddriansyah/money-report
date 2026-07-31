import AccountDesktop from "../components/AccountDesktop";
import AccountLayout from "../components/AccountLayout";
import AccountMobile from "../components/AccountMobile";
import { useAccounts } from "../hooks/useAccounts";

export default function AccountPage() {
  const { accounts, loading, refetch } = useAccounts();

  return (
    <>
      <div className="hidden md:block">
        <AccountLayout
          title="List of Account"
          breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Accounts" }]}
          button={{ label: "Create Account", url: "/account/create" }}>
          <AccountDesktop
            loading={loading}
            accounts={accounts}
            refetch={refetch} />
        </AccountLayout>
      </div>

      <div className="md:hidden">
        <AccountMobile
          loading={loading}
          accounts={accounts}
          refetch={refetch} />
      </div>
    </>
  );
}