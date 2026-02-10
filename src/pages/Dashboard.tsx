import { useEffect, useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import type { Transaction } from "../hooks/useTransactions";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  EyeAlt,
  EyeClosed,
  Trash,
} from "@boxicons/react";
import Header from "../components/layout/Header";
import {
  getPaymentClass,
  getCategoriesImg,
  getTypeClass,
  getTypeDesc,
  formatDate,
  formatRupiah,
} from "../helpers/helper";
import jagoImg from "../assets/payments/Jago.png";

export default function Dashboard() {
  const API_URL =
    "https://sheets.googleapis.com/v4/spreadsheets/1hfMdgqNThzucxyiG3nmMSKrGcXCqpIxRAmbR45iBaDY/values/transactions!A2:K?key=AIzaSyASayZmsushhgaCv6LYHULesUAPydpwsP4";

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

  const [hideBalance, setHideBalance] = useState<boolean>(() => {
    const saved = localStorage.getItem("hideBalance");
    return saved ? JSON.parse(saved) : false;
  });

  // 🔹 bulan aktif
  const currentMonth = MONTHS[new Date().getMonth()];
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [year, setYear] = useState(new Date().getFullYear());
  const selectedMonthIndex = MONTHS.indexOf(selectedMonth);
  const prevMonthLabel = MONTHS[(selectedMonthIndex + 11) % 12];

  const { loading, transactions, balances } = useTransactions(
    API_URL,
    selectedMonthIndex,
    year,
  );

  // 🔹 load more
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // reset load more saat ganti bulan
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedMonth]);

  useEffect(() => {
    localStorage.setItem("hideBalance", JSON.stringify(hideBalance));
  }, [hideBalance]);

  // 🔹 GROUP BY DATE
  const groupedByDate = transactions.reduce(
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

  const getNumber = (id: string) => Number(id.replace(/\D/g, ""));

  sortedDates.forEach((date) => {
    groupedByDate[date].sort(
      (a, b) => getNumber(b.transaction_id) - getNumber(a.transaction_id),
    );
  });

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

  const [openSwipe, setOpenSwipe] = useState<{
    id: string;
    direction: "left" | "right";
  } | null>(null);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handlePrevMonth = () => {
    const currentIndex = MONTHS.indexOf(selectedMonth);

    if (currentIndex === 0) {
      setSelectedMonth(MONTHS[11]);
      setYear((prev) => prev - 1);
    } else {
      setSelectedMonth(MONTHS[currentIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = MONTHS.indexOf(selectedMonth);
    if (currentIndex === 11) {
      setSelectedMonth(MONTHS[0]);
      setYear((prev) => prev + 1);
    } else {
      setSelectedMonth(MONTHS[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-700">
      <Header title="Cashflow 2026" />

      <main className="flex flex-col min-h-screen">
        <section id="head">
          <section id="date" className="flex justify-between gap-4 px-4 py-2">
            <ChevronLeft
              onClick={handlePrevMonth}
              className="w-8 h-8 text-white self-center cursor-pointer"
            />
            <div className="w-full p-1 rounded-lg hover:border hover:border-white/50 text-center cursor-pointer">
              <div className="flex flex-col">
                <span className="text-white/50 text-xs">{year}</span>
                <span className="font-semibold text-md text-white">
                  {`25 ${prevMonthLabel} - 24 ${selectedMonth}`}
                </span>
              </div>
            </div>
            <ChevronRight
              onClick={handleNextMonth}
              className="w-8 h-8 text-white self-center cursor-pointer"
            />
          </section>

          <section id="balanceCurrently" className="px-4 py-8">
            <span className="text-white/80">Balance</span>
            <div className="flex gap-2 items-center">
              <h1 className="text-2xl font-bold text-white transition-all duration-200">
                {hideBalance ? "••••••••" : "Rp 400.000.000"}
              </h1>
              <button
                onClick={() => setHideBalance((prev) => !prev)}
                className="transition-opacity duration-200 cursor-pointer"
              >
                {hideBalance ? (
                  <EyeAlt className="text-white/50" />
                ) : (
                  <EyeClosed className="text-white/50" />
                )}
              </button>
            </div>
          </section>

          <section
            id="balancePayments"
            className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide"
          >
            {Object.entries(balances).map(([payment, saldo]) => (
              <div
                key={payment}
                className="flex-none bg-white/10 rounded-2xl ps-3 pe-6 py-2 flex gap-4 items-center cursor-pointer"
              >
                <div className="bg-white/30 rounded-full w-8 h-8 flex items-center justify-center">
                  <img src={jagoImg} alt={payment} />
                </div>

                <div className="flex flex-col">
                  <span className="text-white/60 text-xs">{payment}</span>
                  <span className="text-md font-medium text-white">
                    {hideBalance ? "••••••••" : formatRupiah(saldo)}
                  </span>
                </div>
              </div>
            ))}
          </section>
        </section>

        <section
          id="transactions"
          className="bg-white rounded-t-3xl flex-1 flex flex-col"
        >
          <div className="pt-4">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-300" />
          </div>
          <div className="px-6 py-4">
            <span className="text-lg font-semibold">Recently Transactions</span>
          </div>

          {/* 🔹 SKELETON LOADER */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-white animate-pulse"
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
            <div className="text-sm text-slate-500 px-6 py-4">
              Tidak ada transaksi pada periode
              {` 25 ${prevMonthLabel} - 24 ${selectedMonth}`}
            </div>
          )}

          {/* 🔹 DATA */}
          <div onClick={() => setOpenSwipe(null)}>
            {visibleDates.map((date) => (
              <div key={date}>
                <div className="flex items-center justify-between px-6 py-4 text-sm font-semibold text-slate-600 bg-gray-50">
                  <span>{formatDate(date)}</span>
                  <span className="text-red-500">
                    {formatRupiah(
                      getTotalExpensesByDate(visibleGroupedByDate[date]),
                    )}
                  </span>
                </div>

                <ul className="divide-y divide-slate-200">
                  {visibleGroupedByDate[date].map((trx) => {
                    const isLeft =
                      openSwipe?.id === trx.transaction_id &&
                      openSwipe.direction === "left";

                    const isRight =
                      openSwipe?.id === trx.transaction_id &&
                      openSwipe.direction === "right";

                    return (
                      <li
                        key={trx.transaction_id}
                        className="relative overflow-hidden"
                      >
                        {/* ACTION LEFT */}
                        <div className="absolute inset-y-0 left-0 flex">
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
                        {/* ACTION RIGHT */}
                        <div className="absolute inset-y-0 right-0 flex">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("DETAIL:", trx.transaction_id);
                            }}
                            className="flex items-center justify-center w-16 text-blue-500 bg-blue-50"
                          >
                            <EyeAlt />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("EDIT:", trx.transaction_id);
                            }}
                            className="flex items-center justify-center w-16 text-yellow-500 bg-yellow-50"
                          >
                            <Edit />
                          </button>
                        </div>

                        {/* MAIN CONTENT */}
                        <div
                          className={`flex items-center gap-4 px-6 py-4 bg-white transition-transform duration-300 ease-out ${isLeft ? "translate-x-16" : isRight ? "-translate-x-32" : "translate-x-0"} `}
                          onTouchStart={(e) => {
                            setTouchStartX(e.touches[0].clientX);
                          }}
                          onTouchEnd={(e) => {
                            if (touchStartX === null) return;

                            const touchEndX = e.changedTouches[0].clientX;
                            const deltaX = touchEndX - touchStartX;

                            // swipe left → open
                            if (deltaX > -40) {
                              setOpenSwipe({
                                id: trx.transaction_id,
                                direction: "left",
                              });
                            }

                            // swipe right → close
                            if (deltaX < 40) {
                              setOpenSwipe({
                                id: trx.transaction_id,
                                direction: "right",
                              });
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
            <div className="flex justify-center mt-4 mb-26">
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
