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
      <DashboardComponentCard title="Total Balance" amount={summary.balance}/>
      <DashboardComponentCard title="Total Income" amount={summary.totalIncome}/>
      <DashboardComponentCard title="Total Expense" amount={summary.totalExpense}/>
      <DashboardComponentCard title="Total Transaction" amount={summary.totalTransactions} isCurrency={false}/>
    </div>
  );
}