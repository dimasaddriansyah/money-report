import { useState } from "react";

export function useTransactionPeriod() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getPeriod = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const start = new Date(year, month - 1, 25);
    const end = new Date(year, month, 24);

    return { start, end };
  };

  const { start, end } = getPeriod(currentDate);

  const today = new Date();
  const currentPeriod = getPeriod(today);

  const isCurrentPeriod =
    start.getTime() === currentPeriod.start.getTime() &&
    end.getTime() === currentPeriod.end.getTime();

  const next = () => {
    if (isCurrentPeriod) return;
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prev = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  return { start, end, next, prev, isCurrentPeriod };
}