import type { Account } from "../../accounts/types/account";
import type { Budget } from "../types/budget";
import { useBalance } from "../../../shared/context/BalanceContext";
import { useState } from "react";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import { useBudgetSummary } from "../hooks/useBudgetSummary";
import { useBudgetEdit } from "../hooks/useBudgetEdit";
import TransactionComponentFilterDate from "../../transactions/components/TransactionComponentFilterDate";
import EmptyState from "../../../shared/ui/EmptyState";
import { MoneySavingJarIcon } from "hugeicons-react";
import ComponentCardTotalBudget from "./ComponentCardTotalBudget";
import ComponentCardListTransfer from "./ComponentCardListTransfer";
import ComponentListBudgetDetail from "./ComponentListBudgetDetail";
import type { Transaction } from "../../transactions/types/transaction";
import BottomSheetEditBudget from "./BottomSheetEditBudget";
import BudgetCreateButton from "./BudgetCreateButton";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  transactions: Transaction[];
  refetch: () => Promise<void>;
};

export default function BudgetMobile(props: Props) {
  const { hideBalance } = useBalance();

  const [openEditBudget, setOpenEditBudget] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const period = useTransactionPeriod(true);

  const summary = useBudgetSummary({
    ...props,
    start: period.start,
    end: period.end,
  });

  const budgetEdit = useBudgetEdit(props.refetch);

  function handleOpenEdit() {
    if (!summary.primary) return;

    setSelectedBudget(summary.primary);
    budgetEdit.open(summary.primary);
    setOpenEditBudget(true);
  }

  function handleCloseEdit() {
    budgetEdit.reset();
    setSelectedBudget(null);
    setOpenEditBudget(false);
  }

  return (
    <>
      <TransactionComponentFilterDate period={period} allowFuture />
      {
        summary.isEmpty ? (
          <EmptyState
            title="No budgets yet"
            subtitle="Create your first budget to start tracking"
            icon={<MoneySavingJarIcon />} />
        ) : (
          <>
            <ComponentCardTotalBudget
              amount={summary.summary.budgetAmount}
              onEdit={handleOpenEdit} />

            <BudgetCreateButton />

            <ComponentCardListTransfer
              items={summary.allocationItems}
              summary={summary.summary}
              accounts={props.accounts}
              hideBalance={hideBalance} />

            <ComponentListBudgetDetail
              items={summary.budgetItems}
              hideBalance={hideBalance} />
          </>
        )
      }
      <BottomSheetEditBudget
        open={openEditBudget}
        budget={selectedBudget}
        edit={budgetEdit}
        onClose={handleCloseEdit} />
    </>
  );
}