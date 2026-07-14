import { useEffect, useMemo, useRef } from "react";
import { AiMagicIcon, ArrowDown01Icon, Calendar03Icon, NoteEditIcon } from "hugeicons-react";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import { useTransactionForm } from "../hooks/useTransactionForm";
import type { Transaction } from "../types/transaction";
import { getAccountFields, TYPE_OPTIONS } from "../utils/ui.helpers";
import { formatDateFull, formatNumber } from "../../../shared/utils/format.helper";
import { getAccountsImg, getCategoriesImg } from "../../../shared/utils/style.helper";
import { useLocation } from "react-router-dom";
import type { FormData } from "../utils/transaction.form.helper";
type Props = {
  defaultValues?: Transaction;
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  prefill?: {
    typeId?: string;
    categoryId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    amount?: number;
    date?: string;
    remark?: string;
  };
};

export default function TransactionFormMobile({
  defaultValues,
  accounts,
  categories,
  onSubmit,
  loading,
}: Props) {
  const location = useLocation();
  const source = location.state?.source ?? "manual";
  const prefill = location.state?.prefill;

  const hasPrefilled = useRef(false);

  const { form, setField, handleTypeChange, getPayload } = useTransactionForm(defaultValues);
  const { typeId, date, fromAccountId, toAccountId, categoryId, remark, amount, } = form;

  const isEdit = !!defaultValues;
  const isTransfer = typeId === "TP003";

  const dateRef = useRef<HTMLInputElement | null>(null);
  const accountContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const accountItemRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const categoryContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const accountFields = useMemo(() => getAccountFields(typeId), [typeId]);
  const amountInput = amount ? formatNumber(amount) : "";

  const isAmountValid = amount > 0;
  const isAccountValid = typeId === "TP003" ? !!fromAccountId && !!toAccountId : !!fromAccountId || !!toAccountId;
  const isCategoryValid = isTransfer ? true : !!categoryId;
  const isRemarkValid = remark.trim().length > 0;
  const isFormValid =
    isAmountValid &&
    isAccountValid &&
    isCategoryValid &&
    isRemarkValid;

  const isReady = !!fromAccountId || !!toAccountId || !!categoryId;

  useEffect(() => {
    if (!isReady) return;

    const scrollToCenter = (
      container: HTMLDivElement | null,
      selectedId: string | null
    ) => {
      if (!container || !selectedId) return;

      const el = accountItemRefs.current[selectedId];
      if (!el) return;

      const containerWidth = container.offsetWidth;
      const elementLeft = el.offsetLeft;
      const elementWidth = el.offsetWidth;

      container.scrollTo({
        left: elementLeft - containerWidth / 2 + elementWidth / 2,
        behavior: "smooth",
      });
    };

    scrollToCenter(accountContainerRefs.current["from"], fromAccountId);
    scrollToCenter(accountContainerRefs.current["to"], toAccountId);
  }, [fromAccountId, toAccountId, isReady]);

  useEffect(() => {
    if (!isReady) return;
    if (!categoryContainerRef.current || !categoryId) return;

    const el = categoryItemRefs.current[categoryId];
    if (!el) return;

    const container = categoryContainerRef.current;

    const scrollLeft =
      el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }, [categoryId, isReady]);

  useEffect(() => {
    if (!prefill) return;
    if (accounts.length === 0 || categories.length === 0) return;
    if (hasPrefilled.current) return;

    setField("typeId", prefill.typeId ?? "");
    setField("categoryId", prefill.categoryId ?? "");
    setField("fromAccountId", prefill.fromAccountId ?? "");
    setField("toAccountId", prefill.toAccountId ?? "");
    setField("amount", prefill.amount ?? 0);
    setField("date", prefill.date ?? "");
    setField("remark", prefill.remark ?? "");

    hasPrefilled.current = true;
  }, [prefill, accounts, categories, setField]);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    const numberValue = Number(raw || 0);
    setField("amount", numberValue);
  }

  if (accounts.length === 0 || categories.length === 0) {
    return source === "generate" ? (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="relative">
          <AiMagicIcon size={36} className="text-amber-500 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
        </div>
        <span className="text-sm text-slate-500">Generating transaction...</span>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading form...</span>
      </div>
    );
  }

  return (
    <>
      <form>
        <div className="flex flex-col gap-3 p-4">
          {/* TYPE */}
          <div className="flex">
            {TYPE_OPTIONS.map((item) => {
              const activeColor =
                item.value === "TP001" ? "bg-green-50 border border-green-300 text-green-500 font-medium" :
                  item.value === "TP002" ? "bg-red-50 border border-red-300 text-red-500 font-medium" :
                    "bg-slate-50 border border-slate-300 text-slate-500 font-medium";

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleTypeChange(item.value)}
                  className={`flex-1 py-2 rounded-lg text-sm cursor-pointer transition
                ${typeId === item.value
                      ? `${activeColor}`
                      : "text-slate-400 hover:text-black"}`}>
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* AMOUNT */}
          <div id="amount" className="flex justify-center bg-slate-50 border border-slate-100 py-6 rounded-2xl">
            <input
              inputMode="numeric"
              value={amountInput}
              onChange={handleAmountChange}
              placeholder="10,000"
              className="w-full bg-transparent border-none outline-none text-center text-4xl font-extrabold text-black placeholder:text-neutral-300 focus:ring-0" />
          </div>

          {/* CATEGORY */}
          {!isTransfer && (
            <div ref={categoryContainerRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {categories.map((row) => {
                const active = categoryId === row.id;

                return (
                  <button
                    key={row.id}
                    ref={(el) => { categoryItemRefs.current[row.id] = el }}
                    type="button"
                    onClick={() => setField("categoryId", categoryId === row.id ? "" : row.id)}
                    className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-2xl border transition cursor-pointer
                    ${active
                        ? "bg-black/90 text-white font-medium"
                        : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"}`}>
                    <img src={getCategoriesImg(row.name)} alt={row.name} className="w-6 h-6" />
                    <span className="text-sm whitespace-nowrap">{row.name}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* ACCOUNT */}
          {accountFields.map((field) => {
            const value = field.key === "fromAccountId" ? fromAccountId : toAccountId;
            const setValue = (val: string) => setField(field.key as "fromAccountId" | "toAccountId", val);
            const filteredAccounts = accounts.filter((acc) => {
              if (field.key === "fromAccountId") return acc.id !== toAccountId;
              if (field.key === "toAccountId") return acc.id !== fromAccountId;
              return true;
            });
            const containerKey = field.key === "fromAccountId" ? "from" : "to";

            return (
              <div key={field.key}>
                <div
                  ref={(el) => { accountContainerRefs.current[containerKey] = el }}
                  className="flex gap-3 overflow-x-auto no-scrollbar">
                  {filteredAccounts.map((acc) => {
                    const active = value === acc.id;

                    return (
                      <button
                        key={acc.id}
                        ref={(el) => { accountItemRefs.current[acc.id] = el }}
                        type="button"
                        onClick={() => setValue(active ? "" : acc.id)}
                        className={`shrink-0 w-22 flex flex-col items-center gap-2 p-3 rounded-2xl transition cursor-pointer
                        ${active
                            ? "bg-black/90 text-white font-medium"
                            : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"}`}>
                        <img src={getAccountsImg(acc.name)} alt={acc.name} className="w-8 h-8" />
                        <span className="text-xs text-center leading-4">{acc.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* DATE */}
          <div id="date" className="flex-1">
            <label className="block text-sm text-slate-500 mb-1">Date</label>
            <div
              onClick={() => dateRef.current?.showPicker()}
              className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <Calendar03Icon className="text-slate-400" size={20} />
                <input
                  ref={dateRef}
                  type="date"
                  value={date}
                  onChange={(e) => setField("date", e.target.value)}
                  className="absolute opacity-0" />
                <span className="capitalize">{formatDateFull(date) || "Select date"}</span>
              </div>
              <ArrowDown01Icon className="text-slate-400" size={20} />
            </div>
          </div>

          {/* REMARK */}
          <div id="remark" className="flex-1">
            <label className="block text-sm text-slate-500 mb-1">Remark <small className="text-red-500">*</small></label>
            <div className="relative flex items-center justify-center">
              <div className="absolute left-4 pointer-events-none">
                <NoteEditIcon className="text-slate-400" size={20} />
              </div>
              <input
                value={remark}
                onChange={(e) => setField("remark", e.target.value)}
                className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${remark ? "text-black" : "text-slate-400"} border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
                placeholder="Input transaction remark" />
            </div>
          </div>
        </div>
      </form>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-4 py-3">
        <button
          type="submit"
          onClick={() => { onSubmit(getPayload()) }}
          disabled={loading || !isFormValid}
          className={`w-full px-5 py-3 text-sm font-semibold text-white rounded-xl
            ${loading || !isFormValid ? "bg-slate-400 cursor-not-allowed" : "bg-black hover:bg-slate-800 cursor-pointer"}`}>
          {loading ? "Saving..." : isEdit ? "Update Transaction" : "Create Transaction"}
        </button>
      </div>
    </>
  )
}

