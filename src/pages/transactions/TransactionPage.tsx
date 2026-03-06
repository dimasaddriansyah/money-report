import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/navigation/Header";
import TransactionForm from "../../components/transactions/TransactionForm";
import type { Transactions, TransactionType } from "../../types/Transactions";
import { useAccounts } from "../../hooks/accounts/useAccounts";
import { useCategories } from "../../hooks/categories/useCategories";
import { formatISODatetoID, getTodayISO, smartCapitalize } from "../../helpers/Format";
import { toast } from "sonner";
import { CapitalizeType } from "../../helpers/CapitalizeType";
import { parseTransactionInput } from "../../helpers/ParseTransactionInput";

interface FormState {
  remark?: string;
  category?: string;
  account?: string;
  from_account?: string;
  to_account?: string;
  nominal: number;
  type: TransactionType;
  date: string;
}

export default function TransactionPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEdit = Boolean(id);
  const transaction = location.state?.transaction as Transactions | undefined;
  const generatedText = location.state?.generatedText as string | undefined;

  const { accounts, loading: loadingAccounts } = useAccounts();
  const { categories, loading: loadingCategories } = useCategories();

  // ============================================================
  // INITIAL FORM STATE
  // ============================================================

  const [form, setForm] = useState<FormState>(() => {
    // EDIT MODE
    if (isEdit && transaction) {
      return {
        remark: transaction.remark,
        category: transaction.category,
        account:
          transaction.type === "income"
            ? transaction.to_account
            : transaction.type === "expenses"
              ? transaction.from_account
              : undefined,
        from_account: transaction.from_account,
        to_account: transaction.to_account,
        nominal: transaction.nominal,
        type: transaction.type,
        date: transaction.date,
      };
    }

    // CREATE MODE WITH GENERATED TEXT
    if (generatedText) {
      const parsed = parseTransactionInput(generatedText);

      return {
        remark: smartCapitalize(parsed.remark) ?? "",
        nominal: parsed.nominal ?? 0,
        category: parsed.category,
        account: parsed.account,
        type: parsed.type ?? "expenses",
        date: parsed.date ?? getTodayISO(),
      };
    }

    // DEFAULT CREATE MODE
    return {
      remark: "",
      nominal: 0,
      type: "expenses",
      date: getTodayISO(),
    };
  });

  // ============================================================
  // HANDLE CHANGE
  // ============================================================

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // MAP ACCOUNT BASED ON TYPE
  // ============================================================

  const mapAccountsByType = (form: FormState) => {
    switch (form.type) {
      case "expenses":
        return {
          from_account: form.account,
        };

      case "income":
        return {
          to_account: form.account,
        };

      case "transfer":
        return {
          from_account: form.from_account,
          to_account: form.to_account,
        };

      default:
        return {};
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    const accountMapping = mapAccountsByType(form);

    const payload = {
      module: "transactions",
      action: isEdit ? "edit" : "create",
      ...(isEdit && { transaction_id: id }),
      ...accountMapping,
      remark: form.remark,
      category: form.category,
      nominal: form.nominal,
      date: form.date,
      dateID: formatISODatetoID(form.date),
      type: CapitalizeType(form.type),
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzBik6KxU6D4Dt5x5DshCFuR3qn0xhsP2EfheR0oB8uuP6KCOAHgDyc5L7cHa8xKnuj/exec",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success(
          `Transaction ${isEdit ? "edited" : "created"} successfully!`,
          {
            duration: 2000,
            onAutoClose: () => navigate("/"),
          },
        );
      } else {
        toast.error("Failed to save transaction", { duration: 2000 });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong!", {
        duration: 2000,
      });
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loadingAccounts || loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-700">
      <Header
        title={isEdit ? "Edit Transaction" : "Add Transaction"}
        showBack
        textColor="text-white"
      />

      <TransactionForm
        form={form}
        accounts={accounts}
        loadingAccounts={loadingAccounts}
        categories={categories}
        loadingCategories={loadingCategories}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
