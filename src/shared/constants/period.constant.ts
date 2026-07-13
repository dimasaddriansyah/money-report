import type { Period } from "../../features/dashboards/utils/period.helper";

export const PERIOD_OPTIONS: {
  label: string;
  value: Period;
}[] = [
  {
    label: "Year",
    value: "year",
  },
  {
    label: "Month",
    value: "month",
  },
  {
    label: "Week",
    value: "week",
  },
  {
    label: "Yesterday",
    value: "yesterday",
  },
  {
    label: "Today",
    value: "today",
  },
];