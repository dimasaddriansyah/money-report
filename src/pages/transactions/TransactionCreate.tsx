import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "../../components/navigation/Header";
import { parseTransactionInput } from "../../helpers/ParseTransactionInput";
import type { TransactionType } from "../../types/Transactions";
import TransactionForm from "../../components/transactions/TransactionForm";
import {
  extractShortDate,
  formatISOToID,
  getTodayISO,
  smartCapitalize,
} from "../../helpers/Format";
import { SparklesIcon } from "hugeicons-react";

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

type TransactionPayload = {
  type: Capitalize<TransactionType>;
  date: string;
  dateID: string;
  nominal: number;
  account?: string;
  from_account?: string;
  to_account?: string;
  category?: string;
  remark?: string;
};

export default function TransactionCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedText = location.state?.generatedText;

  const [isDateManuallyChanged, setIsDateManuallyChanged] = useState(false);

  const [form, setForm] = useState<FormState>({
    nominal: 0,
    type: "expenses",
    date: getTodayISO(),
  });

  const loading = !!generatedText && !form.remark;

  // ===========================================================================
  // PARSE GENERATED TEXT
  // ===========================================================================
  useEffect(() => {
    if (!generatedText) return;

    const timeout = setTimeout(() => {
      const parsed = parseTransactionInput(generatedText);
      const detectedDate = extractShortDate(parsed.remark ?? "");

      setForm((prev) => ({
        ...prev,
        remark: smartCapitalize(parsed.remark) ?? prev.remark,
        category: parsed.category ?? prev.category,
        nominal: parsed.nominal ?? prev.nominal,
        type: parsed.type ?? prev.type,
        date: parsed.date ?? detectedDate ?? prev.date,
        account: parsed.account ?? prev.account,
      }));

      setIsDateManuallyChanged(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [generatedText]);

  // ===========================================================================
  // HANDLE CHANGE
  // ===========================================================================
  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    if (field === "date") {
      setIsDateManuallyChanged(true);
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ===========================================================================
  // HANDLE SUBMIT
  // ===========================================================================
  const handleSubmit = async () => {
    const detectedDate = extractShortDate(form.remark ?? "");

    let finalDate = form.date;

    if (!isDateManuallyChanged && detectedDate) {
      finalDate = detectedDate;
    }

    const payload: TransactionPayload = {
      type: smartCapitalize(form.type) as Capitalize<TransactionType>,
      date: finalDate,
      dateID: formatISOToID(finalDate),
      nominal: form.nominal,
    };

    // 🔥 Mapping dilakukan di sini
    if (form.type === "income") {
      payload.to_account = form.account;
      payload.category = form.category;
      payload.remark = smartCapitalize(form.remark ?? "");
    }

    if (form.type === "expenses") {
      payload.from_account = form.account;
      payload.category = form.category;
      payload.remark = smartCapitalize(form.remark ?? "");
    }

    if (form.type === "transfer") {
      payload.from_account = form.from_account;
      payload.to_account = form.to_account;
      payload.category = "Internal Transfer";
      payload.remark = `Transfer dari ${form.from_account} ke ${form.to_account}`;
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzBTVCS9a28WtZXVWNflmHYLcLRuPYKPZ6xmjoD4t-PxMCMThXP1EHBY1zvsBShypI/exec",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Transaction created successfully!", {
          duration: 2000,
          onAutoClose: () => navigate("/"),
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <main
      className={`min-h-dvh flex flex-col transition-colors duration-300 ${
        loading ? "bg-white" : "bg-slate-700"
      }`}
    >
      <Header
        title="Add Transaction"
        textColor={loading ? "text-slate-800" : "text-white"}
        showBack
      />

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="relative">
            <SparklesIcon className="w-6 h-6 text-slate-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full blur-xl bg-slate-400 opacity-30 animate-ping" />
          </div>

          <p className="mt-2 text-sm text-gray-600 font-medium animate-pulse">
            Generating transaction...
          </p>
        </div>
      ) : (
        <TransactionForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}
    </main>
  );
}
