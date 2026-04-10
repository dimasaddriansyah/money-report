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
import { ArrowDown01Icon, ArrowLeft01Icon, CardExchange02Icon, CreditCardIcon, DateTimeIcon, DollarCircleIcon, LicenseIcon, SparklesIcon } from "hugeicons-react";
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
  // FROM
  // ============================================================
  // const [openCategorySheet, setOpenCategorySheet] = useState(false);
  // const [openAccountSheet, setOpenAccountSheet] = useState(false);
  // const [accountField, setAccountField] = useState<
  //   "account" | "from_account" | "to_account"
  // >("account");

  // ============================================================
  // RENDER
  // ============================================================

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
                      className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer">
                      <ArrowLeft01Icon size={16} />
                    </div>
                    <h1 className="font-semibold text-lg">Create Transaction</h1>
                  </div>
                  <div className="h-px bg-slate-100/60" />
                  <form className="space-y-4">

                    <div className="inline-flex p-0.5 rounded-xl border border-gray-300 overflow-hidden text-sm">
                      <button className="px-6 py-2 bg-slate-900 font-semibold rounded-xl text-white">
                        Income
                      </button>
                      <button className="px-6 py-2 text-slate-400 hover:bg-slate-100">
                        Expenses
                      </button>
                      <button className="px-6 py-2 text-slate-400 hover:bg-slate-100">
                        Transfer
                      </button>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Date
                        </label>
                        <div
                          className="relative flex items-center justify-center"
                        >
                          <div className="absolute left-4 pointer-events-none">
                            <DateTimeIcon className="w-5 h-5 text-slate-400" />
                          </div>
                          <span
                            className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${form.account ? "text-slate-900" : "text-slate-400"} border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
                          >
                            {form.account || "Select date"}
                          </span>
                          <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Nominal
                        </label>
                        <div
                          onClick={() => setOpenCategorySheet(true)}
                          className="relative flex items-center justify-center"
                        >
                          <div className="absolute left-4 pointer-events-none">
                            <DollarCircleIcon className="w-5 h-5 text-slate-400" />
                          </div>
                          <span
                            className="block w-full ps-13 pe-3 py-2.5 text-base text-slate-400 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none"
                          >
                            Input nominal
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SINGLE ACCOUNT INPUT (income & expenses) */}
                    {form.type !== "transfer" && (
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            Account
                          </label>
                          <div
                            onClick={() => {
                              setAccountField("account");
                              setOpenAccountSheet(true);
                            }}
                            className="relative flex items-center justify-center"
                          >
                            <div className="absolute left-4 pointer-events-none">
                              <CreditCardIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <span
                              className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${form.account ? "text-slate-900" : "text-slate-400"} border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
                            >
                              {form.account || "Select account"}
                            </span>
                            <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            Category
                          </label>
                          <div
                            onClick={() => setOpenCategorySheet(true)}
                            className="relative flex items-center justify-center"
                          >
                            <div className="absolute left-4 pointer-events-none">
                              <LicenseIcon className="w-5 h-5 text-slate-400" />
                            </div>
                            <span
                              className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${form.category ? "text-slate-900" : "text-slate-400"} border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
                            >
                              {form.category || "Select category"}
                            </span>
                            <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TRANSFER MODE */}
                    {form.type === "transfer" && (
                      <section className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            From Account
                          </label>
                          <div
                            onClick={() => {
                              setAccountField("from_account");
                              setOpenAccountSheet(true);
                            }}
                            className="relative flex items-center justify-center"
                          >
                            <div className="absolute left-4 pointer-events-none">
                              <CardExchange02Icon className="w-5 h-5 text-slate-400" />
                            </div>
                            <span
                              className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${form.from_account ? "text-slate-900" : "text-slate-400"} border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
                            >
                              {form.from_account || "Select account"}
                            </span>
                            <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            To Account
                          </label>
                          <div
                            onClick={() => {
                              setAccountField("to_account");
                              setOpenAccountSheet(true);
                            }}
                            className="relative flex items-center justify-center"
                          >
                            <div className="absolute left-4 pointer-events-none">
                              <CardExchange02Icon className="w-5 h-5 text-slate-400" />
                            </div>
                            <span
                              className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${form.to_account ? "text-slate-900" : "text-slate-400"} border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
                            >
                              {form.to_account || "Select account"}
                            </span>
                            <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </section>
                    )}

                    {/* REMARK */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Remark {form.type === "transfer" && (<span className="font-light text-slate-400">(optional)</span>)}
                      </label>
                      <textarea
                        value={form.remark || "Input remark"}
                        // onChange={(e) => onChange("remark", e.target.value)}
                        className={`w-full rounded-xl ${form.remark ? "text-slate-900" : "text-slate-400"} border border-gray-300 p-3`}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button className="px-6 py-2 text-sm text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">Reset</button>
                      <button className="px-6 py-2 text-sm text-white font-semibold bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer">Submit</button>
                    </div>
                  </form>
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
