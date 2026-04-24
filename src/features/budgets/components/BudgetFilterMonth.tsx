import { ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";
import { formatDateMonth, formatDateYear } from "../../../shared/utils/format.helper";

type Props = {
  month: string;
  prev: () => void;
  next: () => void;
  isMaxMonth: boolean;
};

export default function BudgetFilterMonth({ month, prev, next, isMaxMonth }: Props) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-50">
      <button
        onClick={prev}
        className="flex p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full cursor-pointer">
        <ArrowLeft01Icon size={20} />
      </button>
      <div className="flex flex-col text-center">
        <span className="text-xs text-slate-400">{formatDateYear(month)}</span>
        <span className="text-black font-semibold">{formatDateMonth(month)}</span>
      </div>
      <button
        onClick={next}
        disabled={isMaxMonth}
        className={`flex p-2 border rounded-full transition
          ${isMaxMonth
            ? "bg-slate-50 text-slate-200 cursor-not-allowed"
            : "bg-white hover:bg-slate-50 border-slate-100 cursor-pointer"}`}>
        <ArrowRight01Icon size={20} />
      </button>
    </div>
  );
}