import { ArrowDown01Icon, CreditCardIcon, DateTimeIcon, DollarCircleIcon, Note05Icon, PencilEdit02Icon } from "hugeicons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Transaction, TransactionType } from "../types/transaction";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import { formatDateDisplay, formatNumber } from "../../../shared/utils/format.helper";
import { getAccountFields } from "../utils/ui.helpers";

type Props = {
  defaultValues?: Transaction;
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: { id?: string; type: string; date: string; fromAccountId?: string; toAccountId?: string; categoryId?: string; amount: number; remark: string }) => void;
  loading?: boolean;
};

export default function TransactionForm({ defaultValues, accounts, categories, onSubmit, loading }: Props) {
  const typeRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);

  const [openType, setOpenType] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState(() => { return new Date().toISOString().split("T")[0] });
  const [openAccount, setOpenAccount] = useState<string | null>(null);
  const [accountsState, setAccountsState] = useState<Record<string, string>>({ fromAccountId: "", toAccountId: "", });
  const [openCategory, setOpenCategory] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState(0);
  const [amountInput, setAmountInput] = useState("");
  const [remark, setRemark] = useState("");

  const accountFields = getAccountFields(type);

  const isEdit = !!defaultValues;
  const isTransfer = type === "transfer";

  const accountMap = useMemo(
    () => Object.fromEntries(accounts.map((row) => [row.id, row.name])),
    [accounts]
  );

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((row) => [row.id, row.name])),
    [categories]
  );

  function handleAccountChange(key: string, value: string) {
    setAccountsState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function setAmountState(value: number) {
    setAmount(value);
    setAmountInput(value ? formatNumber(value) : "");
  }

  useEffect(() => {
    if (!defaultValues) return;
    setType(defaultValues.type || "expense");
    setDate(defaultValues.date || new Date().toISOString().split("T")[0]);
    setAccountsState({ fromAccountId: defaultValues.fromAccountId || "", toAccountId: defaultValues.toAccountId || "", });
    setCategory(defaultValues.categoryId || "");
    setRemark(defaultValues.remark || "");
    setAmountState(defaultValues.amount || 0);
  }, [defaultValues]);

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
    setAmountState(numberValue);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      id: defaultValues?.id,
      type,
      date,
      ...accountsState,
      categoryId: type === "transfer" ? undefined : category,
      amount,
      remark,
    });
  }

  function handleReset() {
    if (type === "transfer") {
      setCategory("");
    }
    setType(defaultValues?.type || "expense");
    setDate(defaultValues?.date || new Date().toISOString().split("T")[0]);
    setAccountsState({ fromAccountId: defaultValues?.fromAccountId || "", toAccountId: defaultValues?.toAccountId || "", });
    setCategory(defaultValues?.categoryId || "");
    setRemark(defaultValues?.remark || "");
    setAmountState(defaultValues?.amount || 0);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div id="type" className="flex-1">
            <label className="block text-sm font-medium text-black mb-1">Type</label>
            <div className="relative" ref={typeRef}>
              <div
                onClick={() => setOpenType((prev) => !prev)}
                className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <CreditCardIcon className="text-slate-400" size={20} />
                  <span className="capitalize">{type}</span>
                </div>
                <ArrowDown01Icon className="text-slate-400" size={20} />
              </div>
              {openType && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-slate-300 rounded-xl overflow-hidden shadow">
                  {["income", "expense", "transfer"].map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setType(item as "income" | "expense" | "transfer");
                        setOpenType(false);
                      }}
                      className={`px-4 py-3 cursor-pointer capitalize ${type === item ? "bg-slate-50 text-black font-medium" : "text-slate-400 hover:bg-slate-50"}`} >
                      {item}
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
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute opacity-0 pointer-events-none"
                />
                <span className="capitalize">{formatDateDisplay(date) || "Select date"}</span>
              </div>
              <ArrowDown01Icon className="text-slate-400" size={20} />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {accountFields.map((field) => (
            <div key={field.key} className="flex-1">
              <label className="block text-sm font-medium text-black mb-1">{field.label}</label>
              <div className="relative" ref={accountRef}>
                <div
                  onClick={() => setOpenAccount(field.key)}
                  className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <CreditCardIcon className="text-slate-400" size={20} />
                    <span className={accountsState[field.key] ? "text-black" : "text-slate-400"}>
                      {accountsState[field.key] ? accountMap[accountsState[field.key]] : `Select ${field.label}`}
                    </span>
                  </div>
                  <ArrowDown01Icon className="text-slate-400" size={20} />
                </div>
                {openAccount === field.key && (
                  <div className="absolute z-50 mt-2 w-full max-h-60 bg-white border rounded-xl overflow-y-auto shadow">
                    {accounts.map((acc) => (
                      <div
                        key={acc.id}
                        onClick={() => {
                          handleAccountChange(field.key, acc.id);
                          setOpenAccount(null);
                        }}
                        className={`px-4 py-3 cursor-pointer ${accountsState[field.key] === acc.id
                          ? "bg-slate-50 text-black font-medium"
                          : "text-slate-400 hover:bg-slate-50"
                          }`}
                      >
                        {acc.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {!isTransfer && (
            <div id="category" className="flex-1">
              <label className="block text-sm font-medium text-black mb-1">Category</label>
              <div className="relative" ref={categoryRef}>
                <div
                  onClick={() => setOpenCategory((prev) => !prev)}
                  className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Note05Icon className="text-slate-400" size={20} />
                    <span className={`${category ? "text-black" : "text-slate-400"}`}>{category ? categoryMap[category] : "Select category"}</span>
                  </div>
                  <ArrowDown01Icon className="text-slate-400" size={20} />
                </div>
                {openCategory && (
                  <div className="absolute z-10 mt-2 w-full max-h-60 bg-white border border-slate-300 rounded-xl overflow-y-auto scrollbar-thin shadow">
                    {categories.map((row) => (
                      <div
                        key={row.id}
                        onClick={() => {
                          setCategory(row.id);
                          setOpenCategory(false);
                        }}
                        className={`px-4 py-3 cursor-pointer ${category === row.id ? "bg-slate-50 text-black font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                        {row.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <div id="amount" className="flex-1">
            <label className="block text-sm font-medium text-black mb-1">Amount</label>
            <div className="relative flex items-center justify-center">
              <div className="absolute left-4 pointer-events-none">
                <DollarCircleIcon className="text-slate-400" size={20} />
              </div>
              <input
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
                onChange={(e) => setRemark(e.target.value)}
                className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${remark ? "text-black" : "text-slate-400"} border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
                placeholder="Input transaction remark"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-2.5 text-sm text-slate-400 rounded-lg cursor-pointer">Reset</button>
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2.5 text-sm font-semibold text-white rounded-lg cursor-pointer
            ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-black hover:bg-slate-800"}
          `}>
          {loading ? "Saving..." : isEdit ? "Update Transaction" : "Create Transaction"}
        </button>
      </div>
    </form>
  )
}

