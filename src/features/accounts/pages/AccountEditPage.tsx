import { useParams } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import AccountLayout from "../components/AccountLayout";
import { useAccounts } from "../hooks/useAccounts";

export default function AccountEditPage() {
  const { id } = useParams();
  const { accounts, loading } = useAccounts();

  const account = accounts.find((acc) => acc.id === id);

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading accounts...
      </div>
    );
  }

  if (!account && accounts.length > 0) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Account not found
      </div>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block">
        <AccountLayout
          title="Form Edit Account"
          breadcrumb={[
            { label: "Dashboard", path: "/" },
            { label: "Accounts", path: "/accounts" },
            { label: "Edit Account" },
          ]}
          showBack
        >
          <AccountForm defaultValues={account} />
        </AccountLayout>
      </div>

      <div className="md:hidden">
        <AccountForm />
      </div>
    </>
  );
}