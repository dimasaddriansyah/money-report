import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown01Icon, CreditCardIcon, DateTimeIcon, DollarCircleIcon, Note05Icon, PencilEdit02Icon } from "hugeicons-react";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import { useTransactionForm } from "../hooks/useTransactionForm";
import type { Transaction } from "../types/transaction";
import { getAccountFields, TYPE_OPTIONS } from "../utils/ui.helpers";
import { formatDateFull, formatNumber } from "../../../shared/utils/format.helper";
import { getAccountsImg, getCategoriesImg } from "../../../shared/utils/style.helper";

type Props = {
  defaultValues?: Transaction;
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: {
    id?: string;
    date: string;
    typeId: string;
    categoryId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    remark: string;
    amount: number;
  }) => void;
  loading?: boolean;
};

export default function TransactionForm({
  defaultValues,
  accounts,
  categories,
  onSubmit,
  loading,
}: Props) {
  const { form, setField, handleTypeChange, getPayload, reset } = useTransactionForm(defaultValues);
  const { typeId, date, fromAccountId, toAccountId, categoryId, remark, amount, } = form;

  const isEdit = !!defaultValues;
  const isTransfer = typeId === "TP003";

  const typeRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);

  const [openType, setOpenType] = useState(false);
  const [openAccount, setOpenAccount] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState(false);

  const accountFields = useMemo(() => getAccountFields(typeId), [typeId]);
  const amountInput = amount ? formatNumber(amount) : "";

  const accountMap = useMemo(
    () => Object.fromEntries(accounts.map((row) => [row.id, row.name])),
    [accounts]
  );

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((row) => [row.id, row.name])),
    [categories]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setOpenType(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setOpenAccount(null);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setOpenCategory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    const numberValue = Number(raw || 0);
    setField("amount", numberValue);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(getPayload());
  }

  function handleReset() {
    reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 md:gap-4 p-4 md:p-0">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div id="typeId" className="flex-1">
            <label className="block text-sm font-medium text-black mb-1">Type</label>
            <div className="relative" ref={typeRef}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenType((prev) => !prev);
                }}
                className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <CreditCardIcon className="text-slate-400" size={20} />
                  <span className="capitalize">{TYPE_OPTIONS.find((opt) => opt.value === typeId)?.label}</span>
                </div>
                <ArrowDown01Icon className="text-slate-400" size={20} />
              </div>
              {openType && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-slate-300 rounded-xl overflow-hidden shadow">
                  {TYPE_OPTIONS.map((item) => (
                    <div
                      key={item.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTypeChange(item.value);
                        setOpenType(false);
                      }}
                      className={`px-4 py-3 cursor-pointer capitalize transition ${typeId === item.value ? "bg-slate-50 text-black font-medium" : "text-slate-400 hover:bg-slate-50"}`} >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div id="date" className="flex-1">
            <label className="block text-sm font-medium text-black mb-1">Date</label>
            <div
              onClick={() => dateRef.current?.showPicker()}
              className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <DateTimeIcon className="text-slate-400" size={20} />
                <input
                  ref={dateRef}
                  type="date"
                  value={date}
                  onChange={(e) => setField("date", e.target.value)}
                  className="absolute opacity-0"/>
                <span className="capitalize">{formatDateFull(date) || "Select date"}</span>
              </div>
              <ArrowDown01Icon className="text-slate-400" size={20} />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {accountFields.map((field) => {
            const value = field.key === "fromAccountId" ? fromAccountId : toAccountId;
            const setValue = (val: string) => { setField(field.key as "fromAccountId" | "toAccountId", val); };
            const filteredAccounts = accounts.filter((acc) => {
              if (field.key === "fromAccountId") return acc.id !== toAccountId;
              if (field.key === "toAccountId") return acc.id !== fromAccountId;
              return true;
            });

            return (
              <div key={field.key} className="flex-1">
                <label className="block text-sm font-medium text-black mb-1">{field.label}</label>
                <div className="relative" ref={openAccount === field.key ? accountRef : null}>
                  <div
                    onClick={() => setOpenAccount(field.key)}
                    className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <CreditCardIcon className="text-slate-400" size={20} />
                      <span className={value ? "text-black" : "text-slate-400"}>
                        {value ? accountMap[value] : `Select ${field.label}`}
                      </span>
                    </div>
                    <ArrowDown01Icon className="text-slate-400" size={20} />
                  </div>
                  {openAccount === field.key && (
                    <div className="absolute z-50 mt-2 w-full max-h-60 bg-white border border-slate-300 rounded-xl overflow-y-auto shadow">
                      {filteredAccounts.map((acc) => (
                        <div
                          key={acc.id}
                          onClick={() => {
                            setValue(acc.id);
                            setOpenAccount(null);
                          }}
                          className={`flex items-center px-4 py-3 gap-4 transition cursor-pointer 
                            ${value === acc.id
                              ? "bg-slate-50 text-black font-medium"
                              : "text-slate-400 hover:bg-slate-50 hover:text-black hover:font-medium"
                            }`}>
                          <img src={getAccountsImg(acc.name)} alt={acc.name} className="w-8 h-8" />
                          <span>{acc.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {!isTransfer && (
            <div id="category" className="flex-1">
              <label className="block text-sm font-medium text-black mb-1">Category</label>
              <div className="relative" ref={categoryRef}>
                <div
                  onClick={() => setOpenCategory((prev) => !prev)}
                  className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Note05Icon className="text-slate-400" size={20} />
                    <span className={`${categoryId ? "text-black" : "text-slate-400"}`}>{categoryId ? categoryMap[categoryId] : "Select category"}</span>
                  </div>
                  <ArrowDown01Icon className="text-slate-400" size={20} />
                </div>
                {openCategory && (
                  <div className="absolute z-10 mt-2 w-full max-h-60 bg-white border border-slate-300 rounded-xl overflow-y-auto scrollbar-thin shadow">
                    {categories.map((row) => (
                      <div
                        key={row.id}
                        onClick={() => {
                          setField("categoryId", row.id)
                          setOpenCategory(false);
                        }}
                        className={`flex items-center px-4 py-3 gap-4 transition cursor-pointer 
                            ${categoryId === row.id
                              ? "bg-slate-50 text-black font-medium"
                              : "text-slate-400 hover:bg-slate-50 hover:text-black hover:font-medium"
                            }`}>
                          <img src={getCategoriesImg(row.name)} alt={row.name} className="w-8 h-8" />
                          <span>{row.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div id="amount" className="flex-1">
            <label className="block text-sm font-medium text-black mb-1">Amount</label>
            <div className="relative flex items-center justify-center">
              <div className="absolute left-4 pointer-events-none">
                <DollarCircleIcon className="text-slate-400" size={20} />
              </div>
              <input
                inputMode="numeric"
                value={amountInput}
                onChange={handleAmountChange}
                className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${amount ? "text-black" : "text-slate-400"} border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
                placeholder="Input transaction amount"
              />
            </div>
          </div>
          <div id="remark" className="flex-1">
            <label className="block text-sm font-medium text-black mb-1">Remark</label>
            <div
              className="relative flex items-center justify-center">
              <div className="absolute left-4 pointer-events-none">
                <PencilEdit02Icon className="text-slate-400" size={20} />
              </div>
              <input
                value={remark}
                onChange={(e) => setField("remark", e.target.value)}
                className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${remark ? "text-black" : "text-slate-400"} border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
                placeholder="Input transaction remark"/>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-end mt-4 gap-2 px-4 md:px-0">
        <button
          type="button"
          onClick={handleReset}
          className="w-full md:w-fit order-2 md:order-1 px-5 py-3 text-sm text-slate-400 rounded-xl cursor-pointer">Reset</button>
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-fit order-1 md:order-2 px-5 py-3 text-sm font-semibold text-white rounded-xl cursor-pointer
            ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-black hover:bg-slate-800"}
          `}>
          {loading ? "Saving..." : isEdit ? "Update Transaction" : "Create Transaction"}
        </button>
      </div>
    </form>
  )
}

