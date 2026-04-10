import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/navigation/Header";
import TransactionForm from "../../components/dashboards/TransactionForm";
import type { Transactions, TransactionType } from "../../types/Transactions";
import { useAccounts } from "../../hooks/accounts/useAccounts";
import { useCategories } from "../../hooks/categories/useCategories";
import {
  formatISODatetoID,
  getTodayISO,
  smartCapitalize,
} from "../../helpers/Format";
import { toast } from "sonner";
import { CapitalizeType } from "../../helpers/CapitalizeType";
import { parseTransactionInput } from "../../helpers/ParseTransactionInput";
import { API_URL } from "../../services/APIServices";
import { ArrowLeft01Icon, SparklesIcon } from "hugeicons-react";
import MobileLayout from "../../components/utils/MobileLayout";
import DesktopLayout from "../../components/utils/DesktopLayout";
import HeaderDesktop from "../../components/utils/HeaderDesktop";
import FooterDesktop from "../../components/utils/FooterDesktop";
import Breadcrumbs from "../../components/utils/Breadcrumbs";

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

export default function TransactionFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEdit = Boolean(id);
  const transaction = location.state?.transaction as Transactions | undefined;
  const generatedText = location.state?.generatedText as string | undefined;

  const { accounts, loading: loadingAccounts } = useAccounts();
  const { categories, loading: loadingCategories } = useCategories();

  const [submitting, setSubmitting] = useState(false);

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
          category: "Internal Transfer",
          remark: `Transfer dari ${form.from_account} ke ${form.to_account}`,
        };

      default:
        return {};
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const accountMapping = mapAccountsByType(form);

    const payload = {
      module: "transactions",
      action: isEdit ? "edit" : "create",
      ...(isEdit && { transaction_id: id }),
      ...accountMapping,
      remark: form.remark || accountMapping.remark || "",
      category: form.category || accountMapping.category || "",
      nominal: form.nominal,
      date: form.date,
      dateID: formatISODatetoID(form.date),
      type: CapitalizeType(form.type),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Success", {
          description: `Transaction ${isEdit ? "edited" : "created"} successfully`,
          duration: 2000,
          onAutoClose: () => navigate("/"),
        });
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

  const isGenerating = Boolean(generatedText);

  if (isGenerating && (loadingAccounts || loadingCategories)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <SparklesIcon className="h-12 w-12 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-white/10 blur-lg animate-ping" />
          </div>

          <span className="text-sm font-semibold">
            Generating transaction...
          </span>

          <span className="text-xs text-slate-400">Analyzing your input</span>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  // ============================================================
  // FORM DESKTOP
  // ============================================================
  const [remark, setRemark] = useState("");

  return (
    <div>
      <DesktopLayout>
        {({ collapsed, setCollapsed }: any) => (
          <>
            {/* HEADER */}
            <HeaderDesktop
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              showBalanceToggle={true}
            />

            {/* CONTENT */}
            <div className="flex flex-col flex-1 overflow-y-auto px-6 py-8 gap-6">
              {/* ROW 1 */}
              <Breadcrumbs
                items={[
                  { label: "Dashboard", path: "/" },
                  { label: "Transactions", path: "/transactions" },
                  { label: "Add Transaction" },
                ]} />

              {/* ROW 2 */}
              <div className="flex-1">
                <div className="flex flex-col bg-white p-4 rounded-lg gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => navigate(-1)}
                      className="p-1.5 border border-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer">
                      <ArrowLeft01Icon size={16}/>
                    </div>
                    <h1 className="font-semibold text-lg">Create Transaction</h1>
                  </div>
                  <div className="h-px bg-slate-100/60" />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <FooterDesktop />
          </>
        )}
      </DesktopLayout>
      <MobileLayout>
        <main className="min-h-screen bg-slate-900">
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
            submitting={submitting}
            isEdit={isEdit}
          />
        </main>
      </MobileLayout>
    </div>
  )
}
