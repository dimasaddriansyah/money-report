import TransactionLayout from "../components/dekstop/TransactionLayout";
import { TransactionFormGenerate } from "../components/TransactionFormGenerate";

export default function TransactionGenerateFormPage() {
  return (
    <>
      <div className="hidden md:block">
        <TransactionLayout
          title="Generate Form Transaction"
          breadcrumb={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Transactions", path: "/transactions" },
            { label: "Generate Form Transaction" },
          ]}
          showBack>
          <TransactionFormGenerate />
        </TransactionLayout>
      </div>

      <div className="md:hidden">
        <TransactionFormGenerate />
      </div>
    </>
  );
}
