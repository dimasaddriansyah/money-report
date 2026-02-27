import BudgetAccountItem from "./BudgetAccountItem";
import type { Budgets } from "../../types/Budgets";
import type { Transactions } from "../../types/Transactions";

interface Props {
  budgetsByAccount: Record<string, Budgets[]>;
  totalBudget: number;
  transactions: Transactions[];
  getProgressStyles: (value: number) => {
    bar: string;
    text: string;
  };
}

export default function BudgetAccountList({
  budgetsByAccount,
  transactions,
  getProgressStyles,
}: Props) {
  return (
    <section className="bg-white rounded-t-3xl overflow-hidden pb-24">
      <div className="h-8 flex items-center justify-center">
        <div className="h-1.5 w-12 rounded-full bg-slate-300" />
      </div>

      <ul className="divide-y divide-slate-100/60">
        {Object.entries(budgetsByAccount).map(([account, items]) => (
          <BudgetAccountItem
            key={account}
            account={account}
            items={items}
            transactions={transactions}
            getProgressStyles={getProgressStyles}
          />
        ))}
      </ul>
    </section>
  );
}
