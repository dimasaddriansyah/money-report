import TransactionLayout from "../components/TransactionLayout";
import { TransactionFormGenerate } from "../components/TransactionFormGenerate";

export default function TransactionGenerateFormPage() {
  return (
    <>
      <div className="hidden md:block">
        <TransactionLayout
          title="Generate Form Transaction"
          breadcrumb={[
            { label: "Dashboard", path: "/" },
            { label: "Transactions", path: "/transactions" },
            { label: "Generate Form Transaction" },
          ]}
          showBack>
          <TransactionFormGenerate/>
        </TransactionLayout>
      </div>

      <div className="md:hidden">
        <TransactionFormGenerate />
      </div>
    </>
  );
}
