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
import { DollarCircleIcon, PlusSignIcon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomSheet from "../../../shared/ui/BottomSheet";
import { formatNumber } from "../../../shared/utils/format.helper";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { toast } from "sonner";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  transactions: Transaction[];
  refetch: () => void;
};

export default function BudgetMobile({
  budgets,
  accounts,
  transactions,
  refetch
}: Props) {
  const navigate = useNavigate();
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

  const [openEditBudget, setOpenEditBudget] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editAmount, setEditAmount] = useState(0);
  const amountInput = editAmount ? formatNumber(editAmount) : "";

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    const numberValue = Number(raw || 0);
    setEditAmount(numberValue);
  }

  const startLabel = start.toLocaleDateString("id-ID", {
    month: "long",
  });

  const endLabel = end.toLocaleDateString("id-ID", {
    month: "long",
    year: start.getFullYear() !== end.getFullYear()
      ? "numeric"
      : undefined,
  });

  const { saveBudget, loading } = useBudgetActions(refetch);

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setEditAmount(budget.amount);
    setOpenEditBudget(true);
  };

  async function handleSaveBudget() {
    if (!selectedBudget) return;

    if (!editAmount || editAmount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      const result = await saveBudget({
        id: selectedBudget.id,
        date: selectedBudget.date,
        remark: selectedBudget.remark,
        amount: editAmount,
      });

      toast.success("Updated", {
        description: result.message,
      });

      setOpenEditBudget(false);

    } catch (error: unknown) {
      let message = "Something went wrong";

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error("Failed to update", {
        description: message,
      });
    }
  }

  return (
    <>
      <TransactionComponentFilterDate period={{ start, end, prev, next, isCurrentPeriod, isMaxPeriod }} allowFuture />
      {isEmpty ? (
        <EmptyState
          title="No budgets yet"
          subtitle="Create your first budget to start tracking" />
      ) : (
        <>
          <ComponentCardTotalBudget amount={budgetPrimary.amount} onEdit={() => handleEditBudget(budgetPrimary)} />

          <ComponentCardListTransfer totalUsage={totalUsage} percentUsage={percentUsage} grouped={grouped} />

          <div className="pb-4 px-4 flex">
            <button
              onClick={() => navigate('/budget/create')}
              className="flex w-full justify-center items-center gap-2 py-3 text-sm font-semibold bg-black text-white rounded-xl hover:bg-black/90 transition cursor-pointer">
              <PlusSignIcon size={20} />
              Create Budget
            </button>
          </div>

          <ComponentListBudgetDetail grouped={grouped} transactionMap={transactionMap} />
        </>
      )}
      <BottomSheet
        open={openEditBudget}
        onClose={() => setOpenEditBudget(false)}
        title={`Edit Budget ${startLabel} - ${endLabel}`}>
        {selectedBudget && (
          <div className="p-4 flex flex-col gap-4">
            <div id="amount" className="flex-1">
              <label className="block text-sm font-medium text-black mb-1">Amount</label>
              <div className="relative flex items-center justify-center">
                <div className="absolute left-4 pointer-events-none">
                  <DollarCircleIcon className="text-slate-400" size={20} />
                </div>
                <input
                  inputMode="numeric"
                  value={amountInput}
                  onChange={handleAmountChange}
                  className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${amountInput ? "text-black" : "text-slate-400"} border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
                  placeholder="Input transaction amount" />
              </div>
            </div>
            <div className="pt-2 flex gap-2">
              <button
                onClick={handleSaveBudget}
                disabled={loading}
                className={`flex-1 py-3 text-white rounded-xl text-sm font-semibold cursor-pointer
                  ${loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-black hover:bg-black/90"}`}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </>
  );
}