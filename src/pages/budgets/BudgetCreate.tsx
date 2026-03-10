import { useState } from "react";
import Header from "../../components/navigation/Header";
import {
  ArrowDown01Icon,
  CreditCardIcon,
  DollarCircleIcon,
} from "hugeicons-react";

export default function BudgetCreate() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh flex flex-col">
      <Header title="Create Budget" showBack />

      <section className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Account
          </label>
          <div className="relative flex items-center justify-center">
            <div className="absolute left-4 pointer-events-none">
              <CreditCardIcon className="w-5 h-5 text-slate-400" />
            </div>
            <span
              className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border text-slate-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
            >
              Select account
            </span>
            <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Nominal
          </label>
          <div className="relative flex items-center justify-center">
            <div className="absolute left-4 pointer-events-none">
              <DollarCircleIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
              placeholder="Input nominal"
              className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border text-slate-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Remark
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-300 p-3"
            rows={3}
          />
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
          <button
            onClick={handleSubmit}
            className="mt-auto w-full rounded-xl bg-slate-900 py-3 text-sm font-medium
            text-white hover:bg-slate-800 active:scale-95 transition
            disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Processing..." : "Add Budget"}
          </button>
        </div>
      </section>
    </main>
  );
}
