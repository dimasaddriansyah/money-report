import { useMemo, useState } from "react";

export function useMonthNavigation(maxFutureMonth = 0) {
  const today = new Date();
  const day = today.getDate();

  const baseDate =
    day >= 25
      ? new Date(today.getFullYear(), today.getMonth() + 1, 1)
      : new Date(today.getFullYear(), today.getMonth(), 1);

  const [currentDate, setCurrentDate] = useState(baseDate);

  const prev = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const next = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);

      // limit berdasarkan baseDate
      const limitDate = new Date(baseDate);
      limitDate.setMonth(baseDate.getMonth() + maxFutureMonth);

      if (
        newDate.getFullYear() > limitDate.getFullYear() ||
        (newDate.getFullYear() === limitDate.getFullYear() &&
          newDate.getMonth() > limitDate.getMonth())
      ) {
        return prev;
      }

      return newDate;
    });
  };

  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const { startDate, endDate } = useMemo(() => {
    const end = new Date(year, monthIndex, 24, 23, 59, 59);
    const start = new Date(year, monthIndex - 1, 25, 0, 0, 0);

    return { startDate: start, endDate: end };
  }, [monthIndex, year]);

  return {
    monthIndex,
    prev,
    next,
    startDate,
    endDate,
  };
}