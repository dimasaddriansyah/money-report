import { useNavigate } from "react-router-dom";
import type { Account } from "../../accounts/types/account";
import type { Transaction } from "../../transactions/types/transaction";
import type { Budget } from "../types/budget";
import { useBalance } from "../../../shared/context/BalanceContext";
import { useState } from "react";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import { getBudgetByPeriod } from "../utils/getBudgetByPeriod.helper";
import { groupBudgetByAccount } from "../utils/groupBudgetByAccount.helper";
import { formatDateMonthRange, formatNumber } from "../../../shared/utils/format.helper";
import TransactionComponentFilterDate from "../../transactions/components/TransactionComponentFilterDate";
import EmptyState from "../../../shared/ui/EmptyState";
import ComponentCardTotalBudget from "./ComponentCardTotalBudget";
import BottomSheet from "../../../shared/ui/BottomSheet";
import { DollarCircleIcon, MoneySavingJarIcon, PlusSignIcon } from "hugeicons-react";
import { toast } from "sonner";
import ComponentCardListTransfer from "./ComponentCardListTransfer";
import ComponentListBudgetDetail from "./ComponentListBudgetDetail";
import { getBudgetSpendingMap } from "../utils/getBudgetSpendingMap.helper";

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
  const { hideBalance } = useBalance();
  const [amountInput, setAmountInput] = useState<string>("");
  const [openEditBudget, setOpenEditBudget] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editAmount, setEditAmount] = useState(0);

  const { saveBudget, loading } = useBudgetActions(refetch);

  const { start, end, prev, next, isCurrentPeriod, isMaxPeriod } = useTransactionPeriod(true);
  const transactionsInPeriod = transactions.filter((trx) => {
    const trxDate = new Date(trx.date);
    return (
      trxDate >= start &&
      trxDate <= end
    );
  });

  const {
    primary: budgetPrimary,
    details: budgetDetails,
  } = getBudgetByPeriod(budgets, start);

  const groupedBudgets = groupBudgetByAccount(budgetDetails, accounts);
  const spendingMap = getBudgetSpendingMap(budgetDetails, transactionsInPeriod);

  const accountMap = new Map(
    accounts.map(a => [a.id, a.name])
  );

  const isEmpty = groupedBudgets.length === 0;

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = Number(raw);
    setEditAmount(numeric);
    setAmountInput(formatNumber(numeric));
  }
  const handleEditBudget = (budget?: Budget) => {
    if (!budget) return;
    setSelectedBudget(budget);
    setEditAmount(budget.amount);
    setAmountInput(formatNumber(budget.amount));
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
          subtitle="Create your first budget to start tracking"
          icon={<MoneySavingJarIcon />} />
      ) : (
        <>
          <ComponentCardTotalBudget amount={budgetPrimary?.amount ?? 0} onEdit={() => handleEditBudget(budgetPrimary)} />

          <ComponentCardListTransfer grouped={groupedBudgets} budgetAmount={budgetPrimary?.amount ?? 0} accounts={accounts} hideBalance={hideBalance} />

          <div className="px-4 flex">
            <button
              onClick={() => navigate('/budget/create')}
              className="flex w-full justify-center items-center gap-2 py-3 text-sm font-semibold bg-black text-white rounded-xl hover:bg-black/90 transition cursor-pointer">
              <PlusSignIcon size={16} />
              Create Budget
            </button>
          </div>

          <ComponentListBudgetDetail budgets={budgetDetails} spendingMap={spendingMap} accountMap={accountMap} hideBalance={hideBalance} />
        </>
      )}
      <BottomSheet
        open={openEditBudget}
        onClose={() => setOpenEditBudget(false)}
        title={`Edit Budget ${budgetPrimary ? formatDateMonthRange(budgetPrimary.date) : ""}`}>
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