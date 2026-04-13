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
    <div className="p-4 bg-white border border-slate-100 rounded-lg space-y-4">
      <div className="p-2 w-fit bg-slate-50 border border-slate-100 rounded-full">
        <Icon size={24} className={colorIcon}/>
      </div>
      <div className="flex flex-col">
        <span className="text-lg text-black font-black">
          {formatBalance(isCurrency ? formatCurrency(amount) : String(amount), hideBalance)}
        </span>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
    </div>
  );
}