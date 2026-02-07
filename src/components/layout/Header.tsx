import { useState } from "react";

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

type HeaderProps = {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
};

export default function Header({
  selectedMonth,
  onMonthChange,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
      <h1 className="text-lg font-semibold text-slate-800">
        Cashflow <span className="text-blue-600">2026</span>
      </h1>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-slate-50"
        >
          {selectedMonth}
          <span className="text-xs">▼</span>
        </button>

        {open && (
          <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border bg-white shadow">
            {MONTHS.map((month) => (
              <button
                key={month}
                onClick={() => {
                  onMonthChange(month);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm
                  ${
                    month === selectedMonth
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "hover:bg-slate-100"
                  }`}
              >
                {month}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
