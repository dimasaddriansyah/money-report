import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/navigation/Header";

export default function GenerateForm() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      // Kalau nanti pakai AI API, taruh di sini
      // const response = await generateTransaction(text);

      navigate("/transaction/create", {
        state: { generatedText: text },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh flex flex-col">
      <Header title="Generate Transaction" showBack />

      <div className="flex-1 p-4 flex flex-col">
        <div className="max-w-md mx-auto w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your transaction
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: Makan nasi padang 35 ribu pakai gopay"
            className="w-full rounded-xl border border-gray-300 p-4 text-base
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition resize-none"
            rows={4}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={!text.trim() || loading}
          className="mt-auto w-full rounded-xl bg-slate-700 py-3 text-sm font-medium
              text-white hover:bg-slate-500 active:scale-95 transition
              disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Processing..." : "Generate Transaction"}
        </button>
      </div>
    </main>
  );
}
