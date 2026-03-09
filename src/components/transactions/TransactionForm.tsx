import type { TransactionType } from "../../types/Transactions";
import { formatISODatetoID, formatRupiahInput } from "../../helpers/Format";
import {
  ArrowDown01Icon,
  Calendar01Icon,
  CreditCardIcon,
  NoteIcon,
} from "hugeicons-react";
import type { Accounts } from "../../types/Accounts";
import type { Categories } from "../../types/Categories";

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
}

export default function TransactionForm({
  form,
  onChange,
  onSubmit,
  accounts,
  loadingAccounts,
  categories,
  loadingCategories,
}: Props) {
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
    form.nominal <= 0 || isTransferInvalid || isNonTransferInvalid;

  return (
    <div className="flex flex-col min-h-screen">
      {/* TYPE SELECTOR */}
      <div className="relative flex bg-gray-100 rounded-xl mx-4 mt-2">
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

        {(["income", "expenses", "transfer"] as TransactionType[]).map((t) => (
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
        ))}
      </div>

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
        <div className="relative flex items-center justify-center rounded-xl border border-gray-300 bg-white  cursor-pointer">
          <Calendar01Icon className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <div className="relative text-center">
            <input
              type="date"
              value={form.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="py-3 text-base font-semibold text-slate-800">
              {formatISODatetoID(form.date)}
            </div>
          </div>
          <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white p-4 flex flex-col flex-1">
        <div className="w-full mx-auto space-y-4">
          {/* SINGLE ACCOUNT INPUT (income & expenses) */}

          {form.type !== "transfer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <div className="relative flex items-center justify-center">
                <div className="absolute left-4 pointer-events-none">
                  <CreditCardIcon className="w-5 h-5 text-slate-400" />
                </div>
                <select
                  disabled={loadingAccounts}
                  value={form.account}
                  onChange={(e) => onChange("account", e.target.value)}
                  className="block w-full ps-11 pe-3 py-2.5 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none"
                >
                  <option value="">Select account</option>
                  {accounts.map((data) => (
                    <option key={data.account_id} value={data.name}>
                      {data.name}
                    </option>
                  ))}
                </select>
                <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* TRANSFER MODE */}
          {form.type === "transfer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Account
                </label>
                <div className="relative flex items-center justify-center">
                  <div className="absolute left-4 pointer-events-none">
                    <CreditCardIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <select
                    disabled={loadingAccounts}
                    value={form.from_account}
                    onChange={(e) => onChange("from_account", e.target.value)}
                    className="block w-full ps-11 pe-3 py-2.5 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none"
                  >
                    <option value="">Select account</option>
                    {accounts.map((data) => (
                      <option key={data.account_id} value={data.name}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                  <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Account
                </label>
                <div className="relative flex items-center justify-center">
                  <div className="absolute left-4 pointer-events-none">
                    <CreditCardIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <select
                    disabled={loadingAccounts}
                    value={form.to_account}
                    onChange={(e) => onChange("to_account", e.target.value)}
                    className="block w-full ps-11 pe-3 py-2.5 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none"
                  >
                    <option value="">Select account</option>
                    {accounts.map((data) => (
                      <option key={data.account_id} value={data.name}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                  <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </>
          )}

          {/* CATEGORY */}
          {form.type !== "transfer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="relative flex items-center justify-center">
                <div className="absolute left-4 pointer-events-none">
                  <NoteIcon className="w-5 h-5 text-slate-400" />
                </div>
                <select
                  disabled={loadingCategories}
                  value={form.category}
                  onChange={(e) => onChange("category", e.target.value)}
                  className="block w-full ps-11 pe-3 py-2.5 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((data) => (
                    <option key={data.category_id} value={data.name}>
                      {data.name}
                    </option>
                  ))}
                </select>
                <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* REMARK */}
          {form.type !== "transfer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
            Create Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
