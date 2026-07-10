import type { DateValue } from "./format.helper";
import { toDate } from "./format.helper";

export type DateFilter =
  | "today"
  | "yesterday"
  | "last_week"
  | "last_month"
  | "last_year"
  | null;


function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}


export function isDateMatch(
  value: DateValue,
  filter: DateFilter
): boolean {

  if (!filter) return true;

  const date = toDate(value);

  if (!date) return false;

  const today = startOfDay(new Date());

  switch (filter) {

    case "today":
      return date >= today;


    case "yesterday": {
      const start = new Date(today);
      start.setDate(start.getDate() - 1);

      return date >= start && date < today;
    }


    case "last_week": {
      const start = new Date(today);
      start.setDate(start.getDate() - 7);

      return date >= start;
    }


    case "last_month": {
      const start = new Date(today);
      start.setMonth(start.getMonth() - 1);

      return date >= start;
    }


    case "last_year": {
      const start = new Date(today);
      start.setFullYear(start.getFullYear() - 1);

      return date >= start;
    }


    default:
      return true;
  }
}