import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import Header from "../components/navigation/Header";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import { MONTHS } from "../helpers/Format";

export default function Insight() {
  const { monthIndex, prev, next, startDate, endDate } = useMonthNavigation();
  const selectedMonth = MONTHS[monthIndex];

  return (
    <div className="bg-slate-700 flex flex-col">
      <Header title="Insight" textColor="text-white" />

      <MonthNavigator
        selectedMonth={selectedMonth}
        onPrev={prev}
        onNext={next}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
