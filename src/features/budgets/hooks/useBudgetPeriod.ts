import { useState } from "react";

export function useBudgetPeriod() {
  const today = new Date();

  const [month, setMonth] = useState(() =>
    today.toISOString().slice(0, 7)
  );

  // current month
  const currentDate = new Date(today.toISOString().slice(0, 7) + "-01");

  // 🔥 max = next month
  const maxDate = new Date(currentDate);
  maxDate.setMonth(maxDate.getMonth() + 1);

  const prev = () => {
    const date = new Date(month + "-01");
    date.setMonth(date.getMonth() - 1);
    setMonth(date.toISOString().slice(0, 7));
  };

  const next = () => {
    const date = new Date(month + "-01");
    date.setMonth(date.getMonth() + 1);

    // 🔥 guard: tidak boleh lebih dari max
    if (date > maxDate) return;

    setMonth(date.toISOString().slice(0, 7));
  };

  // 🔥 disable kalau sudah di max
  const isMaxMonth = new Date(month + "-01").getTime() === maxDate.getTime();

  return {
    month,
    prev,
    next,
    isMaxMonth,
  };
}