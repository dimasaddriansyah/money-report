import type { TransactionType } from "../../types/Transactions";
import { formatISODatetoID, formatRupiahInput } from "../../helpers/Format";
import {
  ArrowDown01Icon,
  Calendar01Icon,
  CardExchange02Icon,
  CreditCardIcon,
  LicenseIcon,
} from "hugeicons-react";
import type { Accounts } from "../../types/Accounts";
import type { Categories } from "../../types/Categories";
import { useState } from "react";
import BottomSheet from "../utils/BottomSheet";
import { getAccountsImg, getCategoriesImg } from "../../helpers/UI";

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

interface Props {
  form: FormState;
  accounts: Accounts[];
  loadingAccounts: boolean;
  categories: Categories[];
  loadingCategories: boolean;
  onChange: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  onSubmit: () => void;
  submitting: boolean;
  isEdit: boolean;
}

export default function TransactionForm({
  form,
  onChange,
  onSubmit,
  accounts,
  categories,
  submitting,
  isEdit,
}: Props) {
  const [openCategorySheet, setOpenCategorySheet] = useState(false);
  const [openAccountSheet, setOpenAccountSheet] = useState(false);
  const [accountField, setAccountField] = useState<
    "account" | "from_account" | "to_account"
  >("account");
  const formattedNominal = formatRupiahInput(form.nominal.toString());

  const handleNominalChange = (value: string) => {
    const raw = Number(value.replace(/\D/g, ""));
    onChange("nominal", raw);
  };

  const isTransferInvalid =
    form.type === "transfer" &&
    (!form.from_account ||
      !form.to_account ||
      form.from_account === form.to_account);

  const isNonTransferInvalid =
    form.type !== "transfer" && (!form.category || !form.remark);

  const isDisabled =
    form.nominal <= 0 ||
    isTransferInvalid ||
    isNonTransferInvalid ||
    submitting;

  return (
    <div className="flex flex-col min-h-screen">
      {/* NOMINAL */}
      <input
        value={formattedNominal || 0}
        onChange={(e) => handleNominalChange(e.target.value)}
        inputMode="numeric"
        className="w-full text-4xl font-semibold text-center text-white
          border-none outline-none focus:ring-0 appearance-none py-8 px-4"
      />

      {/* DATE */}
      <div className="m-4">
        <div className="relative flex items-center justify-center rounded-xl border border-white/20 bg-white/5 cursor-pointer">
          <Calendar01Icon className="absolute left-4 w-5 h-5 text-white/70 pointer-events-none" />
          <div className="relative text-center">
            <input
              type="date"
              value={form.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="py-3 text-base font-semibold text-white">
              {formatISODatetoID(form.date)}
            </div>
          </div>
          <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-white/70 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white px-4 py-6 pb-4 flex flex-col flex-1 rounded-3xl">
        <div className="w-full mx-auto space-y-4">
          {/* TYPE SELECTOR */}
          <div className="relative flex bg-gray-100 rounded-xl py-1">
            <div
              className={`absolute top-1 bottom-1 w-1/3 rounded-lg bg-white shadow transition-all duration-300
            ${
              form.type === "income"
                ? "left-0"
                : form.type === "expenses"
                  ? "left-1/3"
                  : "left-2/3"
            }`}
            />

            {(["income", "expenses", "transfer"] as TransactionType[]).map(
              (t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChange("type", t)}
                  className={`relative flex-1 py-2 text-sm font-medium z-10 transition cursor-pointer
                ${
                  form.type === t
                    ? t === "income"
                      ? "text-green-600"
                      : t === "expenses"
                        ? "text-red-500"
                        : "text-blue-600"
                    : "text-gray-500"
                }`}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ),
            )}
          </div>

          {/* SINGLE ACCOUNT INPUT (income & expenses) */}
          {form.type !== "transfer" && (
            <div>
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
          )}

          {/* CATEGORY */}
          {form.type !== "transfer" && (
            <div>
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
          )}

          {/* REMARK */}
          {form.type !== "transfer" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Remark
              </label>
              <textarea
                value={form.remark ?? ""}
                onChange={(e) => onChange("remark", e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3"
                rows={3}
              />
            </div>
          )}

          {/* TRANSFER MODE */}
          {form.type === "transfer" && (
            <section className="space-y-4">
              <div>
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

              <div>
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
        </div>

        {/* SUBMIT */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
          <button
            onClick={onSubmit}
            disabled={isDisabled}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium
            text-white hover:bg-slate-800 active:scale-95 transition
            disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Edit Transaction"
                : "Create Transaction"}
          </button>
        </div>
      </div>

      {/* Account Sheet */}
      <BottomSheet
        open={openAccountSheet}
        onClose={() => setOpenAccountSheet(false)}
        title="Select Account"
      >
        <div className="divide-y divide-slate-100/60">
          {accounts.map((data) => (
            <div
              key={data.account_id}
              onClick={() => {
                onChange(accountField, data.name);
                setOpenAccountSheet(false);
              }}
              className={`w-full flex items-center gap-3 text-left px-2 py-3 rounded-2xl transition cursor-pointer
                ${
                  form.account === data.name
                    ? "bg-slate-900 font-medium text-white"
                    : "hover:bg-slate-100"
                }`}
            >
              <img
                src={getAccountsImg(data.name)}
                alt={data.name}
                className="w-8 h-8"
              />
              <span>{data.name}</span>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* Categories Sheet */}
      <BottomSheet
        open={openCategorySheet}
        onClose={() => setOpenCategorySheet(false)}
        title="Select Category"
      >
        <div className="divide-y divide-slate-100/60">
          {categories.map((data) => (
            <div
              key={data.category_id}
              onClick={() => {
                onChange("category", data.name);
                setOpenCategorySheet(false);
              }}
              className={`w-full flex items-center gap-3 text-left px-2 py-3 rounded-2xl transition cursor-pointer
                ${
                  form.category === data.name
                    ? "bg-slate-900 font-medium text-white"
                    : "hover:bg-slate-100"
                }`}
            >
              <img
                src={getCategoriesImg(data.name)}
                alt={data.name}
                className="w-8 h-8"
              />
              <span>{data.name}</span>
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
