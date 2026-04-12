import { formatCurrency } from "../../../shared/utils/format.helper";

type Props = {
  title: string
  amount: number
  isCurrency?: boolean;
};

export default function DashboardComponentCard({ title, amount, isCurrency = true }: Props) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex flex-col">
        <span className="text-xl text-black font-black">{isCurrency ? formatCurrency(amount) : amount}</span>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
    </div>
  );
}