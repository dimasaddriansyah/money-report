import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";
import { formatPeriod } from "../utils/date.helper";

type Props = {
  period: {
    start: Date;
    end: Date;
    prev: () => void;
    next: () => void;
    isCurrentPeriod: boolean;
    isMaxPeriod: boolean;
  };
  allowFuture?: boolean;
};

export default function TransactionComponentFilterDate({ period, allowFuture = false }: Props) {
  const { start, end, prev, next, isCurrentPeriod } = period;
  const { label, year } = formatPeriod(start, end);
  const isDisabled = !allowFuture
    ? isCurrentPeriod
    : period.isMaxPeriod;

  return (
    <section className="flex items-center justify-between px-4 py-3">
      <button
        onClick={prev}
        className="flex p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full cursor-pointer">
        <ArrowLeft01Icon size={20} />
      </button>
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400">{year}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <button
        onClick={next}
        disabled={isDisabled}
        className={`flex p-2 border rounded-full transition
          ${isDisabled
            ? "bg-slate-50 text-slate-200 cursor-not-allowed"
            : "bg-white hover:bg-slate-50 border-slate-100 cursor-pointer"}`}>
        <ArrowRight01Icon size={20} />
      </button>
    </section>
  );
}