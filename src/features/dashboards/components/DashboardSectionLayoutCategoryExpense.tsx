import type { Transaction } from "../../transactions/types/transaction";
import type { Category } from "../../categories/types/category";
import { useCategoryExpenseData } from "../hooks/useCategoryExpenseData";
import DashboardComponenChartCategoryExpense from "./DashboardComponenChartCategoryExpense";
import { DashboardComponentListCategoryExpense } from "./DashboardComponentListCategoryExpense";
import EmptyState from "../../../shared/ui/EmptyState";

type Props = {
  transactions: Transaction[];
  categories: Category[];
};

export default function DashboardSectionLayoutCategoryExpense({ transactions, categories }: Props) {
  const isEmpty = transactions.length === 0;
  const { list, chart } = useCategoryExpenseData(transactions, categories);

  return (
    <>
      {isEmpty ? (
        <EmptyState
          title="No transactions yet"
          subtitle="Create your first transaction to start tracking"
        />
      ) : (
        <>
          <DashboardComponenChartCategoryExpense data={chart} />
          <DashboardComponentListCategoryExpense data={list}/>
        </>
      )}
    </>
  );
}