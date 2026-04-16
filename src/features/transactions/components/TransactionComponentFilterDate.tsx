import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";
import { formatPeriod } from "../utils/date.helper";

type Props = {
  period: {
    start: Date;
    end: Date;
    prev: () => void;
    next: () => void;
    isCurrentPeriod: boolean;
  };
};

export default function TransactionComponentFilterDate({ period }: Props) {
  const { start, end, prev, next, isCurrentPeriod } = period;
  const { label, year } = formatPeriod(start, end);

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
      {!isCurrentPeriod ? (
        <button
          onClick={next}
          className="flex p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full cursor-pointer">
          <ArrowRight01Icon size={20} />
        </button>
      ) : (
        <div className="w-10" />
      )}
    </section>
  );
}