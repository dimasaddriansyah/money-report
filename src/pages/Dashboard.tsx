import { useEffect, useState } from "react";
import { Edit, Trash } from "@boxicons/react";
import Header from "../components/layout/Header";
import {
  getPaymentClass,
  getCategoriesImg,
  getTypeClass,
  getTypeDesc,
  formatDate,
  formatRupiah,
} from "../helpers/helper";

type Transaction = {
  transaction_id: string;
  date: string;
  type: string;
  payment: string;
  category: string;
  remark: string;
  nominal: string;
};

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const PAGE_SIZE = 20;

export default function Dashboard() {
  const API_URL =
    "https://sheets.googleapis.com/v4/spreadsheets/1hfMdgqNThzucxyiG3nmMSKrGcXCqpIxRAmbR45iBaDY/values/transactions!A2:K?key=AIzaSyASayZmsushhgaCv6LYHULesUAPydpwsP4";

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 bulan aktif
  const currentMonth = MONTHS[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // 🔹 load more
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // reset load more saat ganti bulan
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedMonth]);

  // 🔹 FETCH DATA
  useEffect(() => {
    setLoading(true);

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const rows = data.values ?? [];

        const mapped: Transaction[] = rows.map((row: string[]) => ({
          transaction_id: row[0] ?? "",
          date: row[2] ?? "",
          type: row[3] ?? "",
          payment: row[4] ?? "",
          category: row[5] ?? "",
          remark: row[6] ?? "",
          nominal: row[7] ?? "",
        }));

        mapped.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setTransactions(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🔹 FILTER BULAN
  const filteredTransactions = transactions.filter((trx) => {
    if (!trx.date) return false;
    const monthIndex = new Date(trx.date).getMonth();
    return MONTHS[monthIndex] === selectedMonth;
  });

  // 🔹 GROUP BY DATE
  const groupedByDate = filteredTransactions.reduce(
    (acc: Record<string, Transaction[]>, trx) => {
      if (!acc[trx.date]) acc[trx.date] = [];
      acc[trx.date].push(trx);
      return acc;
    },
    {},
  );

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const getTotalExpensesByDate = (transactions: Transaction[]) =>
    transactions
      .filter((trx) => trx.type === "Expenses")
      .reduce((sum, trx) => sum + Number(trx.nominal.replace(/[^\d]/g, "")), 0);

  // 🔹 FLATTEN → SLICE → GROUP ULANG (UNTUK LOAD MORE)
  const flatTransactions = sortedDates.flatMap((date) => groupedByDate[date]);

  const visibleTransactions = flatTransactions.slice(0, visibleCount);

  const visibleGroupedByDate = visibleTransactions.reduce(
    (acc: Record<string, Transaction[]>, trx) => {
      if (!acc[trx.date]) acc[trx.date] = [];
      acc[trx.date].push(trx);
      return acc;
    },
    {},
  );

  const visibleDates = Object.keys(visibleGroupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  return (
    <div className="min-h-screen pb-26 ">
      <Header selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

      <main className="bg-blue-500">
        <section id="head" className="p-4 ">
          <h1 className="text-lg font-semibold">Transactions Test</h1>
        </section>

        <section id="transactions" className="bg-white rounded-t-3xl">
          <div className="pt-4">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300" />
          </div>
          <div className="p-4">
            <span className="text-lg font-semibold">Recently Transactions</span>
          </div>
          {/* 🔹 SKELETON LOADER */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-white border rounded-lg animate-pulse"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="w-20 h-3 rounded bg-slate-200" />
                    <div className="w-3/4 h-4 rounded bg-slate-200" />
                    <div className="w-1/2 h-3 rounded bg-slate-200" />
                  </div>
                  <div className="w-24 h-4 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          )}

          {/* 🔹 EMPTY STATE */}
          {!loading && visibleDates.length === 0 && (
            <div className="text-sm text-slate-500">
              Tidak ada transaksi di bulan {selectedMonth}
            </div>
          )}

          {/* 🔹 DATA */}
          <div onClick={() => setOpenSwipeId(null)}>
            {visibleDates.map((date) => (
              <div key={date}>
                <div className="flex items-center justify-between px-4 py-4 text-sm font-semibold text-slate-600 bg-gray-50">
                  <span>{formatDate(date)}</span>
                  <span className="text-red-500">
                    {formatRupiah(
                      getTotalExpensesByDate(visibleGroupedByDate[date]),
                    )}
                  </span>
                </div>

                <ul className="divide-y divide-slate-200">
                  {visibleGroupedByDate[date].map((trx) => {
                    const isOpen = openSwipeId === trx.transaction_id;

                    return (
                      <li
                        key={trx.transaction_id}
                        className="relative overflow-hidden"
                      >
                        {/* ACTION BUTTONS (KANAN) */}
                        <div className="absolute inset-y-0 right-0 flex">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("EDIT:", trx.transaction_id);
                            }}
                            className="flex items-center justify-center w-16 text-yellow-500 bg-yellow-50"
                          >
                            <Edit />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("DELETE:", trx.transaction_id);
                            }}
                            className="flex items-center justify-center w-16 text-red-500 bg-red-50"
                          >
                            <Trash />
                          </button>
                        </div>

                        {/* MAIN CONTENT */}
                        <div
                          className={`flex items-center gap-4 p-4 bg-white transition-transform duration-300 ease-out ${isOpen ? "-translate-x-32" : "translate-x-0"} `}
                          onTouchStart={(e) => {
                            setTouchStartX(e.touches[0].clientX);
                          }}
                          onTouchEnd={(e) => {
                            if (touchStartX === null) return;

                            const touchEndX = e.changedTouches[0].clientX;
                            const deltaX = touchEndX - touchStartX;

                            // swipe left → open
                            if (deltaX < -40) {
                              setOpenSwipeId(trx.transaction_id);
                            }

                            // swipe right → close
                            if (deltaX > 40) {
                              setOpenSwipeId(null);
                            }

                            setTouchStartX(null);
                          }}
                        >
                          <img
                            src={getCategoriesImg(trx.category)}
                            alt={trx.category}
                            className="w-12 h-12"
                          />

                          <div className="flex-1 min-w-0">
                            <span
                              className={`inline-block mb-1 px-2 py-0.5 text-[10px] border rounded-full font-medium ${getPaymentClass(
                                trx.payment,
                              )}`}
                            >
                              {trx.payment}
                            </span>

                            <div className="text-sm font-medium line-clamp-1">
                              {trx.remark}
                            </div>
                            <div className="text-xs text-slate-500">
                              {trx.category}
                            </div>
                          </div>

                          <div
                            className={`text-sm font-semibold ${getTypeClass(trx.type)}`}
                          >
                            {getTypeDesc(trx.type)} {trx.nominal}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* 🔹 LOAD MORE */}
          {!loading && visibleCount < flatTransactions.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-6 py-2 text-sm font-medium bg-white border rounded-full cursor-pointer text-slate-700 hover:bg-slate-100"
              >
                Load more data
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
