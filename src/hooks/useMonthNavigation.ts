import { useMemo, useState } from "react";

export function useMonthNavigation() {
  const today = new Date();

  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const prev = () => {
    setMonthIndex((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const next = () => {
    setMonthIndex((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  // 🔥 INI BAGIAN BARU
  const { startDate, endDate } = useMemo(() => {
    // End date = tanggal 24 bulan terpilih
    const end = new Date(year, monthIndex, 24);

    // Start date = tanggal 25 bulan sebelumnya
    const start = new Date(year, monthIndex - 1, 25);

    return {
      startDate: start,
      endDate: end,
    };
  }, [monthIndex, year]);

  return {
    monthIndex,
    year,
    prev,
    next,
    startDate,
    endDate,
  };
}