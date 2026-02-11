import { useState } from "react";
import Header from "../../components/layout/Header";

export default function TransactionCreate() {
  const [text, setText] = useState("");

  const createTransaction = () => {
    console.log("Create:", text);
  };

  return (
    <main className="min-h-[100dvh] flex flex-col">
      <Header title="Add Transaction" showBack />

      {/* Content */}
      <div className="flex-1 w-full max-w-md mx-auto p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: Buatkan ringkasan laporan keuangan bulanan dengan bahasa sederhana..."
          className="w-full rounded-xl border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: Buatkan ringkasan laporan keuangan bulanan dengan bahasa sederhana..."
          className="w-full rounded-xl border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
        />
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remark
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: Buatkan ringkasan laporan keuangan bulanan dengan bahasa sederhana..."
          className="w-full rounded-xl border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
        />
      </div>

      {/* Button Bottom */}
      <div className="w-full max-w-md mx-auto sticky bottom-0 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={createTransaction}
          disabled={!text.trim()}
          className="w-full rounded-xl bg-slate-600 py-3 text-sm font-medium
                     text-white hover:bg-slate-700 active:scale-95 transition
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Create Transaction
        </button>
      </div>
    </main>
  );
}
