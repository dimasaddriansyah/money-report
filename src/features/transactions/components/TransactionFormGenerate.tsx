import { useState } from "react";
import { parseTransaction, type ParsedTransaction, type TransactionType } from "../utils/generate.helper";
import { useCategories } from "../../categories/hooks/useCategories";
import { useAccounts } from "../../accounts/hooks/useAccounts";
import { useNavigate } from "react-router-dom";
import { ArrowLeft01Icon } from "hugeicons-react";

const TRANSACTION_TYPE_MAP: Record<TransactionType, string> = {
  income: "TP001",
  expense: "TP002",
  transfer: "TP003",
};

export function TransactionFormGenerate() {
  const navigate = useNavigate();

  const { accounts } = useAccounts();
  const { categories } = useCategories();

  const [draft, setDraft] = useState<ParsedTransaction>({
    raw: "",
    type: "expense",
    category: "",
    amount: 0,
    toAccount: "",
    fromAccount: "",
    date: "",
    remark: "",
  });

  const isFormValid = draft.raw.trim().length > 0;

  function handleGenerate() {
    const result = parseTransaction(draft.raw);

    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === result.category.toLowerCase()
    );

    const matchedFromAccount = accounts.find(
      (a) => a.name.toLowerCase() === result.fromAccount.toLowerCase()
    );

    const matchedToAccount = accounts.find(
      (a) => a.name.toLowerCase() === result.toAccount.toLowerCase()
    );

    const payload = {
      typeId: TRANSACTION_TYPE_MAP[result.type],
      categoryId: matchedCategory?.id ?? "",
      fromAccountId: matchedFromAccount?.id ?? "",
      toAccountId: matchedToAccount?.id ?? "",
      amount: result.amount,
      date: result.date,
      remark: result.remark,
    };

    navigate("/transaction/create", {
      state: {
        source: "generate",
        prefill: payload,
      },
    });
  }

  return (
    <>
      <div className="relative flex items-center p-5 border-b border-slate-100">
        <div
          onClick={() => navigate(-1)}
          className="flex p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full cursor-pointer">
          <ArrowLeft01Icon size={20} />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 font-semibold">Generate Form</span>
      </div>

      <div className="m-4">
        <label className="block text-sm text-black mb-1">Describe Transaction</label>
        <textarea
          rows={3}
          value={draft.raw}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              raw: e.target.value,
            }))
          }
          className="block w-full p-3 text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="e.g. makan siang 25 ribu kemarin"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-4 py-3">
        <button
          type="button"
          disabled={!isFormValid}
          onClick={handleGenerate}
          className={`w-full px-5 py-3 text-sm font-semibold text-white rounded-xl
            ${!isFormValid ? "bg-slate-400 cursor-not-allowed" : "bg-black hover:bg-slate-800 cursor-pointer"}`}>
          Generate Transaction
        </button>
      </div>
    </>
  );
}