import EmptyState from "../../../shared/ui/EmptyState";
import type { Account } from "../../accounts/types/account";
import TransactionComponentFilterDate from "../../transactions/components/TransactionComponentFilterDate";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import { useBudgetGroupedByAccount } from "../hooks/useBudgetGroupedByAccount";
import type { Budget } from "../types/budget";
import { useBudgetGetBudget } from "../hooks/useBudgetGetBudget";
import ComponentCardTotalBudget from "./ComponentCardTotalBudget";
import ComponentCardListTransfer from "./ComponentCardListTransfer";
import ComponentListBudgetDetail from "./ComponentListBudgetDetail";
import type { Transaction } from "../../transactions/types/transaction";
import { getTransactionMap } from "../utils/getTransactionMap.helper";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  transactions: Transaction[];
  refetch: () => void;
};

export default function BudgetMobile({ 
  budgets, 
  accounts, 
  transactions 
}: Props) {
  const { start, end, prev, next, isCurrentPeriod, isMaxPeriod } = useTransactionPeriod(true);
  const grouped = useBudgetGroupedByAccount({ budgets, start, end, accounts });
  const isEmpty = grouped.length === 0;

  const budgetPrimary = useBudgetGetBudget({ budgets, start })
  const transactionMap = getTransactionMap(transactions, start);

  const totalUsage = grouped.reduce((sum, g) => sum + g.total, 0);
  const percentUsage =
    budgetPrimary?.amount
      ? Math.min(Math.round((totalUsage / budgetPrimary.amount) * 100))
      : 0

  return (
    <>
      <TransactionComponentFilterDate period={{ start, end, prev, next, isCurrentPeriod, isMaxPeriod }} allowFuture />
      {isEmpty ? (
        <EmptyState
          title="No budgets yet"
          subtitle="Create your first budget to start tracking" />
      ) : (
        <>
          <ComponentCardTotalBudget amount={budgetPrimary.amount} />

          <ComponentCardListTransfer totalUsage={totalUsage} percentUsage={percentUsage} grouped={grouped} />

          <ComponentListBudgetDetail grouped={grouped} transactionMap={transactionMap} />
        </>
      )}
    </>
  );
}