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
import BudgetMobileSkeleton from "./BudgetMobileSkeleton";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  transactions: Transaction[];
  loading: boolean;
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

  const sortedBudgetItems = [...summary.budgetItems].sort((a, b) => {
    const accountA = props.accounts.find(
      (account) => account.id === a.accountId
    );

    const accountB = props.accounts.find(
      (account) => account.id === b.accountId
    );

    return (accountA?.name ?? "").localeCompare(accountB?.name ?? "");
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

  if (props.loading) {
    return <BudgetMobileSkeleton />;
  }

  return (
    <>
      <TransactionComponentFilterDate period={period} allowFuture />
      <div className="mt-26">
        <ComponentCardTotalBudget
          amount={summary.summary.budgetAmount}
          onEdit={handleOpenEdit} />

        <BudgetCreateButton />

        {
          summary.isEmpty ? (
            <EmptyState
              title="No budgets yet"
              subtitle="Create your first budget to start tracking"
              icon={<MoneySavingJarIcon />} />
          ) : (
            <>
              <ComponentCardListTransfer
                items={summary.allocationItems}
                summary={summary.summary}
                accounts={props.accounts}
                hideBalance={hideBalance} />

              <ComponentListBudgetDetail 
                items={sortedBudgetItems}
                hideBalance={hideBalance} />
            </>
          )
        }
      </div>
      <BottomSheetEditBudget
        open={openEditBudget}
        budget={selectedBudget}
        edit={budgetEdit}
        onClose={handleCloseEdit} />
    </>
  );
}