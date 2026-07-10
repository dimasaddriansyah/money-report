import { useNavigate, useParams } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import AccountLayout from "../components/AccountLayout";
import { useAccounts } from "../hooks/useAccounts";
import { useAccountActions } from "../hooks/useAccountActions";
import { toast } from "sonner";
import type { FormData } from "../helper/account.form.helper";

export default function AccountEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { accounts, loading: isFetchingAccounts } = useAccounts();
  const { updateAccount, loading } = useAccountActions();
  const account = accounts.find((acc) => acc.id === id);

  async function handleSubmit(data: FormData) {
    try {
      const result = await updateAccount(data);
      navigate("/accounts")
      toast.success("Success", {
        description: result.message,
      });
    } catch (error: unknown) {
      let message = "Failed to save account";
      if (error instanceof Error) { message = error.message }
      toast.error("Failed to save account", {
        description: message,
        duration: 2000,
      });
    }
  }

  if (isFetchingAccounts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading accounts...</span>
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
          showBack>
          <AccountForm
            key={account.id}
            defaultValues={account}
            onSubmit={handleSubmit}
            loading={loading} />
        </AccountLayout>
      </div>

      <div className="md:hidden">
        <AccountForm
          key={account.id}
          defaultValues={account}
          onSubmit={handleSubmit}
          loading={loading} />
      </div>
    </>
  );
}