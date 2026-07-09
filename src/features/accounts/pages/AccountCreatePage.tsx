import { useNavigate } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import AccountLayout from "../components/AccountLayout";
import { useAccountActions } from "../hooks/useAccountActions";
import { toast } from "sonner";
import type { FormData } from "../helper/account.form.helper";

export default function AccountCreatePage() {
  const navigate = useNavigate();
  const { createAccount, loading } = useAccountActions();

  async function handleSubmit(data: FormData) {
    try {
      const result = await createAccount(data);
      navigate("/accounts")
      toast.success("Success", {
        description: result.message
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

  return (
    <>
      <div className="hidden md:block">
        <AccountLayout
          title="Form Create Account"
          breadcrumb={[
            { label: "Dashboard", path: "/" },
            { label: "Accounts", path: "/accounts" },
            { label: "Create Account" },
          ]}
          showBack>
          <AccountForm onSubmit={handleSubmit} loading={loading} />
        </AccountLayout>
      </div>

      <div className="md:hidden">
        <AccountForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}