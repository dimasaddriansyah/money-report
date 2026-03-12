import { useEffect, useRef, useState } from "react";
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

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <main className="min-h-dvh flex flex-col">
      <Header title="Generate Transaction" showBack />

      <section className="">
        <div className="w-full p-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Describe your transaction
          </label>

          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: Makan nasi padang 35 ribu pakai gopay"
            className="w-full rounded-xl border border-gray-300 p-4 text-base
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition resize-none"
            rows={4}
          />
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || loading}
            className="mt-auto w-full rounded-xl bg-slate-900 py-3 text-sm font-medium
            text-white hover:bg-slate-800 active:scale-95 transition
            disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Processing..." : "Generate Transaction"}
          </button>
        </div>
      </section>
    </main>
  );
}
