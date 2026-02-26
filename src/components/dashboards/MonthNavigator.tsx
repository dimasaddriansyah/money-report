import { MONTHS } from "../../helpers/Format";
import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";

interface Props {
  selectedMonth: string;
  onPrev: () => void;
  onNext: () => void;
  startDate: Date;
  endDate: Date;
}

export default function MonthNavigator({
  selectedMonth,
  onPrev,
  onNext,
  startDate,
  endDate,
}: Props) {
  const selectedMonthIndex = MONTHS.indexOf(selectedMonth);
  const prevMonthLabel = MONTHS[(selectedMonthIndex + 11) % 12];

  const today = new Date();
  const end = new Date(endDate);

  const isFuturePeriod = end >= today;

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const yearLabel =
    startYear === endYear ? `${endYear}` : `${startYear} - ${endYear}`;

  return (
    <section className="flex justify-between items-center gap-4 px-4 py-2">
      <ArrowLeft01Icon
        onClick={onPrev}
        strokeWidth={2}
        className="w-8 h-8 text-white cursor-pointer"
      />

      <div className="text-center">
        <span className="text-white/70 text-xs">{yearLabel}</span>
        <div className="text-white font-semibold">
          {`25 ${prevMonthLabel} - 24 ${selectedMonth}`}
        </div>
      </div>

      <ArrowRight01Icon
        onClick={!isFuturePeriod ? onNext : undefined}
        strokeWidth={2}
        className={`w-8 h-8 transition ${
          isFuturePeriod
            ? "text-white/30 cursor-not-allowed"
            : "text-white cursor-pointer hover:scale-110"
        }`}
      />
    </section>
  );
}
