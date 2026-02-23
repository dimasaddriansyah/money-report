import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "../../components/Header";
import { PencilSparkles } from "@boxicons/react";
import { parseTransactionInput } from "../../helpers/ParseTransaction";
import type { TransactionType } from "../../types/Transactions";
import TransactionForm from "../../components/transactions/TransactionForm";
import {
  extractDateFromText,
  getTodayISO,
  smartCapitalize,
} from "../../helpers/Format";

interface FormState {
  remark: string;
  category: string;
  payment: string;
  nominal: number;
  type: TransactionType;
  date: string;
}

export default function TransactionCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const generatedText = location.state?.generatedText;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    remark: "",
    category: "",
    payment: "",
    nominal: 0,
    type: "expenses",
    date: getTodayISO(),
  });

  useEffect(() => {
    if (!generatedText) return;

    setLoading(true);

    const timeout = setTimeout(() => {
      const parsed = parseTransactionInput(generatedText);

      setForm({
        ...parsed,
        remark: parsed.remark ?? "",
        category: parsed.category ?? "",
        payment: parsed.payment ?? "",
        nominal: parsed.nominal ?? 0,
        type: parsed.type ?? "expenses",
        date: parsed.date ?? getTodayISO(),
      });
      setLoading(false);
    }, 800); // animasi delay
    return () => clearTimeout(timeout);
  }, [generatedText]);

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const detectedDate = extractDateFromText(form.remark);
    const updatedForm = {
      ...form,
      remark: smartCapitalize(form.remark),
      type: smartCapitalize(form.type),
      date: detectedDate ?? form.date,
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbz_fgmm34g_Gftc8bSWjcArKRHZ0vFyv0qBNsoHcOFEp6Kej8kY45M38RG09MEf7A3-/exec",
        {
          method: "POST",
          body: JSON.stringify({
            date: updatedForm.date,
            type: updatedForm.type,
            payment: updatedForm.payment,
            category: updatedForm.category,
            remark: updatedForm.remark,
            nominal: updatedForm.nominal,
          }),
        },
      );

      const result = await response.json();

      if (result.status === "success") {
        console.log("Saved with ID:", result.transaction_id);
        toast.success("Transaction created successfully!", {
          duration: 2000,
          onAutoClose: () => navigate("/"),
        });
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <main className="min-h-dvh flex flex-col bg-blue-500">
      <Header title="Add Transaction" textColor="text-white" showBack />

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="relative">
            <PencilSparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full blur-xl bg-indigo-400 opacity-30 animate-ping" />
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
