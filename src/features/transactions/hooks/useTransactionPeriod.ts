import { useState, useMemo } from "react";

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

export function useTransactionPeriod(allowFuture = false) {
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

  const nextPeriodDate = new Date(today);
  nextPeriodDate.setMonth(nextPeriodDate.getMonth() + 1);
  const nextPeriod = getPeriod(nextPeriodDate);

  const isMaxPeriod =
    start.getTime() === nextPeriod.start.getTime() &&
    end.getTime() === nextPeriod.end.getTime();

  // ⏭ next period
  const next = () => {
    if (!allowFuture && isCurrentPeriod) return;

    if (allowFuture && isMaxPeriod) return;

    setCurrentDate(prev => {
      const d = new Date(prev);
      return new Date(d.getFullYear(), d.getMonth() + 1, 25);
    });
  };

  // ⏮ prev period
  const prev = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      return new Date(d.getFullYear(), d.getMonth() - 1, 25)
    });
  };

  return {
    start,
    end,
    next,
    prev,
    isCurrentPeriod,
    isMaxPeriod
  };
}