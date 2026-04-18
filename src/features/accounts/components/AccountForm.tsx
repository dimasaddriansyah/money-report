import { CreditCardIcon } from "hugeicons-react";
import { useState } from "react";
import type { Account } from "../types/account";

type Props = {
  defaultValues?: Account;
  onSubmit: (data: { id?: string; name: string; createdAt?: string }) => void;
  loading?: boolean;
};

export default function AccountForm({ defaultValues, onSubmit, loading }: Props) {
  const isEdit = !!defaultValues;
  const [name, setName] = useState(defaultValues?.name || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      id: defaultValues?.id,
      name,
      createdAt: defaultValues?.createdAt,
    });
  }

  function handleReset() {
    setName(defaultValues?.name || "");
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-0">
      <div className="flex gap-4">
        <div id="category" className="flex-1">
          <label className="block text-sm font-medium text-gray-900 mb-1">Account Name</label>
          <div className="relative flex items-center justify-center">
            <div className="absolute left-4 pointer-events-none">
              <CreditCardIcon className="text-slate-400" size={20} />
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${name ? "text-slate-900" : "text-slate-400"} border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400 transition appearance-none`}
              placeholder="Input account name"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row-reverse mt-4 gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="order-2 px-5 py-2.5 text-sm text-slate-400 rounded-lg cursor-pointer">Reset</button>
        <button
          type="submit"
          disabled={loading}
          className={`order-1 px-5 py-2.5 text-sm font-semibold text-white rounded-lg cursor-pointer
            ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"}
          `}>
          {loading ? "Saving..." : isEdit ? "Update Account" : "Create Account"}
        </button>
      </div>
    </form>
  )
}

