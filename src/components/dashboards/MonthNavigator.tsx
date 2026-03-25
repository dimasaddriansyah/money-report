import { MONTHS } from "../../helpers/Format";
import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";

interface Props {
  selectedMonth: string;
  onPrev: () => void;
  onNext: () => void;
  startDate: Date;
  endDate: Date;
  variant?: "mobile" | "desktop";
}

export default function MonthNavigator({
  selectedMonth,
  onPrev,
  onNext,
  startDate,
  endDate,
  variant,
}: Props) {
  const selectedMonthIndex = MONTHS.indexOf(selectedMonth);
  const prevMonthLabel = MONTHS[(selectedMonthIndex + 11) % 12];

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const yearLabel =
    startYear === endYear ? `${endYear}` : `${startYear} - ${endYear}`;

  if (variant === "desktop") {
    return (
      <section className="flex justify-between items-center gap-4 px-4 py-6">
        <ArrowLeft01Icon
          onClick={onPrev}
          strokeWidth={2}
          className="w-4 h-4 text-slate-400 cursor-pointer hover:scale-110 transition"
        />

        <div className="text-center">
          <span className="text-slate-900/70 text-xs">{yearLabel}</span>
          <div className="text-slate-900 text-sm font-semibold">
            {`25 ${prevMonthLabel} - 24 ${selectedMonth}`}
          </div>
        </div>

        <ArrowRight01Icon
          onClick={onNext}
          strokeWidth={2}
          className="w-4 h-4 text-slate-400 cursor-pointer hover:scale-110 transition"
        />
      </section>
    );
  } else {
    return (
      <section className="flex justify-between items-center gap-4 px-4 py-6">
        <ArrowLeft01Icon
          onClick={onPrev}
          strokeWidth={2}
          className="w-8 h-8 text-white cursor-pointer hover:scale-110 transition"
        />

        <div className="text-center">
          <span className="text-white/70 text-xs">{yearLabel}</span>
          <div className="text-white font-semibold">
            {`25 ${prevMonthLabel} - 24 ${selectedMonth}`}
          </div>
        </div>

        <ArrowRight01Icon
          onClick={onNext}
          strokeWidth={2}
          className="w-8 h-8 text-white cursor-pointer hover:scale-110 transition"
        />
      </section>
    );
  }
}
