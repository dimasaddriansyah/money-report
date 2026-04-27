import { useBalance } from "../../../shared/context/BalanceContext";

type Props = {
  value: number;
};

export default function ComponentCircularProgress({ value }: Props) {
  const { hideBalance } = useBalance();
  const safeValue = Math.min(Math.max(value, 0), 100);
  const color =
    safeValue >= 100
      ? "oklch(63.7% 0.237 25.331)"
      : safeValue >= 70
        ? "oklch(76.9% 0.188 70.08)"
        : "oklch(72.3% 0.219 149.579)";

  return (
    <div className="relative w-10 h-10 hover:scale-110 transition-transform duration-200">
      <div
        className="w-full h-full rounded-full shadow-sm transition-all duration-500"
        style={{ background: `conic-gradient(${color} ${safeValue}%, #f1f5f9 ${safeValue}%)` }} />
      <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
        <span className="text-[10px] font-medium text-slate-500">
          {hideBalance ? "••" : safeValue}%
        </span>
      </div>
    </div>
  );
}