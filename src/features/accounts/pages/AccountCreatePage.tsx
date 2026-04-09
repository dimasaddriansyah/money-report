import AccountForm from "../components/AccountForm";
import AccountLayout from "../components/AccountLayout";

export default function AccountCreatePage() {
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
          showBack
        >
          <AccountForm />
        </AccountLayout>
      </div>

      <div className="md:hidden">
        <AccountForm />
      </div>
    </>
  );
}