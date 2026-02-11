import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";

export default function GenerateForm() {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    navigate("/transaction/create");
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header title="Generate Input" showBack />

      {/* Content */}
      <div className="flex-1 w-full max-w-md mx-auto p-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prompt / Teks
        </label>

        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: Buatkan ringkasan laporan keuangan bulanan dengan bahasa sederhana..."
          className="w-full rounded-xl border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        <p className="mt-2 text-xs text-gray-500">
          Masukkan teks panjang yang ingin diproses.
        </p>
      </div>

      {/* Button Bottom */}
      <div className="w-full max-w-md mx-auto sticky bottom-0 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={handleGenerate}
          disabled={!text.trim()}
          className="w-full rounded-xl bg-slate-600 py-3 text-sm font-medium
                     text-white hover:bg-slate-700 active:scale-95 transition
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Generate Text
        </button>
      </div>
    </main>
  );
}
