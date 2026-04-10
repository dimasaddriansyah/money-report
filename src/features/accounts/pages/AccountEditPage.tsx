import { useNavigate, useParams } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import AccountLayout from "../components/AccountLayout";
import { useAccounts } from "../hooks/useAccounts";
import { useAccountActions } from "../hooks/useAccountActions";
import { toast } from "sonner";

export default function AccountEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { accounts, loading: isFetchingAccounts } = useAccounts();
  const { saveAccount, loading } = useAccountActions();
  const account = accounts.find((acc) => acc.id === id);

  async function handleSubmit(data: { id?: string; name: string }) {
    try {
      const result = await saveAccount(data);
      navigate("/accounts")
      toast.success("Success", {
        description: result.message,
      });
    } catch (error: any) {
      toast.error("Failed to update account", {
        description: error.message,
        duration: 2000,
      });
    }
  }

  if (isFetchingAccounts) {
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
          <AccountForm defaultValues={account} onSubmit={handleSubmit} loading={loading} />
        </AccountLayout>
      </div>

      <div className="md:hidden">
        <AccountForm defaultValues={account} onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}