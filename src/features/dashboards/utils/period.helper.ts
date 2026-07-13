export type Period =
  | "year"
  | "month"
  | "week"
  | "yesterday"
  | "today";

export function isDateInPeriod(
  date: Date,
  period: Period,
  selectedMonth: Date = new Date()
) {
  const now = new Date();

  switch (period) {
    case "year":
      return date.getFullYear() === now.getFullYear();

    case "month": {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      const day = selectedMonth.getDate();

      const startDate =
        day >= 25
          ? new Date(year, month, 25, 0, 0, 0, 0)
          : new Date(year, month - 1, 25, 0, 0, 0, 0);

      const endDate =
        day >= 25
          ? new Date(year, month + 1, 24, 23, 59, 59, 999)
          : new Date(year, month, 24, 23, 59, 59, 999);

      return date >= startDate && date <= endDate;
    }

    case "week": {
      const day = now.getDay();

      const diff =
        now.getDate() -
        day +
        (day === 0 ? -6 : 1);

      const startOfWeek = new Date(now);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(now);
      endOfWeek.setHours(23, 59, 59, 999);

      return date >= startOfWeek && date <= endOfWeek;
    }

    case "yesterday": {
      const yesterday = new Date(now);

      yesterday.setDate(now.getDate() - 1);

      return (
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
      );
    }

    case "today": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);

      const end = new Date(now);
      end.setHours(23, 59, 59, 999);

      return date >= start && date <= end;
    }

    default:
      return true;
  }
}