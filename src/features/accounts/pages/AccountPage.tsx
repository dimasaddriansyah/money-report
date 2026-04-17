import AccountDesktop from "../components/AccountDesktop";
import AccountLayout from "../components/AccountLayout";
import AccountMobile from "../components/AccountMobile";
import { useAccounts } from "../hooks/useAccounts";

export default function AccountPage() {
  const {
    accounts,
    loading,
    refetch,
    page,
    meta,
    setPage } = useAccounts();

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading accounts...
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <AccountLayout
          title="List of Account"
          breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Accounts" }]}
          button={{ label: "Create Account", url: "/account/create" }}>
          <AccountDesktop
            accounts={accounts}
            refetch={refetch}
            page={page}
            meta={meta}
            setPage={setPage} />
        </AccountLayout>
      </div>

      <div className="md:hidden">
        {/* <AccountMobile
          accounts={accounts}
          refetch={refetch}
          page={page}
          meta={meta}
          setPage={setPage} /> */}
      </div>
    </>
  );
}