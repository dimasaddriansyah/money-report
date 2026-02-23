import { ChevronLeft, ChevronRight } from "@boxicons/react";
import { MONTHS } from "../../helpers/Format";

interface Props {
  selectedMonth: string;
  year: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthNavigator({
  selectedMonth,
  year,
  onPrev,
  onNext,
}: Props) {
  const selectedMonthIndex = MONTHS.indexOf(selectedMonth);
  const prevMonthLabel = MONTHS[(selectedMonthIndex + 11) % 12];

  return (
    <section className="flex justify-between items-center gap-4 px-4 py-2">
      <ChevronLeft
        onClick={onPrev}
        className="w-8 h-8 text-white cursor-pointer"
      />

      <div className="text-center">
        <span className="text-white/70 text-xs">{year}</span>
        <div className="text-white font-semibold">
          {`25 ${prevMonthLabel} - 24 ${selectedMonth}`}
        </div>
      </div>

      <ChevronRight
        onClick={onNext}
        className="w-8 h-8 text-white cursor-pointer"
      />
    </section>
  );
}
