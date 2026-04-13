import { DollarCircleIcon, Invoice01Icon, MoneyReceive01Icon, MoneySend01Icon } from "hugeicons-react";
import DashboardComponentCard from "./DasboardComponentCard";

type Props = {
  summary: {
    totalTransactions: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
};

export default function DashboardSectionSummary({ summary }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <DashboardComponentCard title="Total Balance" amount={summary.balance} icon={DollarCircleIcon} colorIcon="text-blue-500"/>
      <DashboardComponentCard title="Total Income" amount={summary.totalIncome} icon={MoneyReceive01Icon} colorIcon="text-green-500"/>
      <DashboardComponentCard title="Total Expense" amount={summary.totalExpense} icon={MoneySend01Icon} colorIcon="text-red-500"/>
      <DashboardComponentCard title="Total Transaction" amount={summary.totalTransactions} isCurrency={false} icon={Invoice01Icon} colorIcon="text-slate-500"/>
    </div>
  );
}