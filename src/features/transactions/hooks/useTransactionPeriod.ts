import { useMemo, useState } from "react";

function getPeriod(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const start =
    day >= 25
      ? new Date(year, month, 25, 0, 0, 0, 0)
      : new Date(year, month - 1, 25, 0, 0, 0, 0);

  const end =
    day >= 25
      ? new Date(year, month + 1, 24, 23, 59, 59, 999)
      : new Date(year, month, 24, 23, 59, 59, 999);

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

  // ⏭ Next Period
  const next = () => {
    if (!allowFuture && isCurrentPeriod) return;
    if (allowFuture && isMaxPeriod) return;

    setCurrentDate(() => {
      const d = new Date(start);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  // ⏮ Previous Period
  const prev = () => {
    setCurrentDate(() => {
      const d = new Date(start);
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
    isMaxPeriod,
  };
}