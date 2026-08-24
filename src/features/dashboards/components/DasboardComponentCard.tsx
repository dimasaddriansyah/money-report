import { Dollar01Icon } from "hugeicons-react";
import { useBalance } from "../../../shared/context/BalanceContext";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";

type Props = {
  title: string
  amount: number
  icon?: React.ComponentType<{ size?: number }>
  colorIcon: string;
  isCurrency?: boolean;
};

export default function DashboardComponentCard({ title, amount, icon, colorIcon, isCurrency = true }: Props) {
  const { hideBalance } = useBalance();

  const Icon = icon || Dollar01Icon;

  return (
    <div className="relative flex items-center p-4 bg-white border border-slate-100 rounded-lg gap-5 overflow-hidden">
      <Icon size={24} className={`text-${colorIcon}-500`} />
      <div className="flex flex-col">
        <span className="text-base text-black font-black tabular-nums">
          {formatBalance(isCurrency ? formatCurrency(amount) : String(amount), hideBalance)}
        </span>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${colorIcon}-500`} />
    </div>
  );
}