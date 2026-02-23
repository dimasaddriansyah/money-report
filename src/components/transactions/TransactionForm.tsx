import type { TransactionType } from "../../types/Transactions";
import { formatRupiahInput } from "../../helpers/Format";
import { WalletAlt, CardView, CalendarAlt, ChevronDown } from "@boxicons/react";

interface FormState {
  remark: string;
  category: string;
  payment: string;
  nominal: number;
  type: TransactionType;
  date: string;
}

interface Props {
  form: FormState;
  onChange: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  onSubmit: () => void;
}

const FIELD_ICONS = {
  payment: WalletAlt,
  category: CardView,
};

export default function TransactionForm({ form, onChange, onSubmit }: Props) {
  const formattedNominal = formatRupiahInput(form.nominal.toString());

  const handleNominalChange = (value: string) => {
    const raw = Number(value.replace(/\D/g, ""));
    onChange("nominal", raw);
  };

  return (
    <div className="flex flex-col flex-1">
      {/* NOMINAL */}
      <input
        value={formattedNominal}
        onChange={(e) => handleNominalChange(e.target.value)}
        inputMode="numeric"
        className="w-full text-4xl font-semibold text-center text-white
          border-none outline-none focus:ring-0 appearance-none py-8 px-4"
      />

      {/* TYPE SELECTOR */}
      <div className="relative flex bg-gray-100 rounded-xl mx-4">
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
            className={`relative flex-1 py-2 text-sm font-medium z-10 transition 
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

      {/* DATE */}
      <div className="m-4">
        <div
          className="relative flex items-center justify-center rounded-xl border border-gray-300 bg-white"
          onClick={() => {
            const input = document.getElementById(
              "dateInput",
            ) as HTMLInputElement | null;
            input?.showPicker();
          }}
        >
          {/* LEFT ICON */}
          <CalendarAlt className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />

          {/* INPUT */}
          <input
            id="dateInput"
            type="date"
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full text-center py-3 px-12 text-base font-semibold text-slate-700 
                 bg-transparent outline-none appearance-none cursor-pointer"
          />

          {/* RIGHT ICON */}
          <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white p-4 flex flex-col flex-1">
        {/* INPUT FIELDS */}
        <div className="w-full max-w-md mx-auto">
          {(["payment", "category", "remark"] as const).map((field) => {
            const Icon = FIELD_ICONS[field as keyof typeof FIELD_ICONS];

            return (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field}
                </label>

                {field === "remark" ? (
                  <textarea
                    value={form[field]}
                    onChange={(e) => onChange(field, e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                ) : (
                  <div className="relative flex items-center justify-center">
                    {/* LEFT ICON */}
                    {Icon && (
                      <div className="absolute left-4 pointer-events-none">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <input
                      value={form[field]}
                      onChange={(e) => onChange(field, e.target.value)}
                      className="block w-full ps-11 pe-3 py-2.5 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                    />
                    {/* RIGHT ICON */}
                    <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SUBMIT */}
        <button
          onClick={onSubmit}
          disabled={!form.remark.trim()}
          className="mt-auto w-full rounded-xl bg-slate-600 py-3 text-sm font-medium
            text-white hover:bg-slate-700 active:scale-95 transition
            disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Create Transaction
        </button>
      </div>
    </div>
  );
}
