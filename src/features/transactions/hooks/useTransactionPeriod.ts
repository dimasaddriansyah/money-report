import { useState, useMemo } from "react";

// helper: format ke YYYY-MM-DD (tanpa timezone issue)
function toDateString(date: Date) {
  return date.toLocaleDateString("en-CA"); // 2026-04-25
}

function getPeriod(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const start =
    day >= 25
      ? new Date(year, month, 25)
      : new Date(year, month - 1, 25);

  const end =
    day >= 25
      ? new Date(year, month + 1, 24)
      : new Date(year, month, 24);

  return { start, end };
}

export function useTransactionPeriod() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { start, end } = useMemo(
    () => getPeriod(currentDate),
    [currentDate]
  );

  const today = new Date();
  const currentPeriod = getPeriod(today);

  const isCurrentPeriod =
    start.getTime() === currentPeriod.start.getTime() &&
    end.getTime() === currentPeriod.end.getTime();

  // ⏭ next period
  const next = () => {
    if (isCurrentPeriod) return;

    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  // ⏮ prev period
  const prev = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  return {
    start,
    end,
    next,
    prev,
    isCurrentPeriod,
  };
}