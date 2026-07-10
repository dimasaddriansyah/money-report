import type { Account } from "../../accounts/types/account";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import type { Transaction } from "../../transactions/types/transaction";
import { useBalance } from "../../../shared/context/BalanceContext";
import { useNavigate } from "react-router-dom";
import TransactionComponentFilterDate from "../../transactions/components/TransactionComponentFilterDate";
import { getBudgetByPeriod } from "../utils/getBudgetByPeriod.helper";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { type GroupedBudget, groupBudgetByAccount } from "../utils/groupBudgetByAccount.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import { getBudgetSpendingMap } from "../utils/getBudgetSpendingMap.helper";
import EmptyState from "../../../shared/ui/EmptyState";
import { createLookup } from "../../../shared/utils/lookup.helper";
import { formatBalance, formatCurrency, formatNumber, toDate } from "../../../shared/utils/format.helper";
import ComponentBudgetTransferModal from "./ComponentBudgetTransferModal";
import ComponentBudgetEditModal from "./ComponentBudgetEditModal";
import { Add01Icon, MoneySavingJarIcon, NoteEditIcon } from "hugeicons-react";
import type { Budget } from "../types/budget";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  transactions: Transaction[];
  refetch: () => Promise<void>;
};

type ModalState =
  | { type: "listTransfer"; data: GroupedBudget }
  | { type: "editBudget"; data: Budget }
  | null;

export default function BudgetDesktop({
  budgets,
  accounts,
  transactions,
  refetch
}: Props) {
  const navigate = useNavigate();
  const { hideBalance } = useBalance();
  const [amount, setAmount] = useState<number>(0);
  const [amountInput, setAmountInput] = useState<string>("");
  const [modal, setModal] = useState<ModalState>(null);

  const { updateBudget, loading } = useBudgetActions(refetch);

  const { start, end, prev, next, isCurrentPeriod, isMaxPeriod } = useTransactionPeriod(true);
  const transactionsInPeriod = useMemo(
    () =>
      transactions.filter((trx) => {
        const trxDate = toDate(trx.date);

        return (
          trxDate !== null &&
          trxDate >= start &&
          trxDate <= end
        );
      }),
    [transactions, start, end],
  );

  const {
    primary: budgetPrimary,
    details: budgetDetails,
  } = useMemo(
    () => getBudgetByPeriod(budgets, start),
    [budgets, start],
  );

  const groupedBudgets = useMemo(
    () => groupBudgetByAccount(budgetDetails, accounts),
    [budgetDetails, accounts],
  );

  const totalAllocation = useMemo(
    () =>
      groupedBudgets.reduce(
        (sum, budget) => sum + budget.total,
        0,
      ),
    [groupedBudgets],
  );
  const budgetAmount = budgetPrimary?.amount ?? 0;
  const isOverBudget = totalAllocation > budgetAmount;

  const accountLookup = useMemo(
    () => createLookup(accounts),
    [accounts],
  );

  const spendingMap = useMemo(
    () =>
      getBudgetSpendingMap(
        budgetDetails,
        transactionsInPeriod,
      ),
    [budgetDetails, transactionsInPeriod],
  );

  const isEmpty = groupedBudgets.length === 0;

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = Number(raw);

    setAmount(numeric);
    setAmountInput(formatNumber(numeric));
  }

  function handleOpenEditModal() {
    if (!budgetPrimary?.amount) {
      toast.error("Budget not found");
      return;
    }

    setAmount(budgetPrimary.amount);
    setAmountInput(formatNumber(budgetPrimary.amount));

    setModal({
      type: "editBudget",
      data: budgetPrimary,
    });
  }

  function handleOpenTransferModal(
    budget: GroupedBudget,
  ) {
    setModal({
      type: "listTransfer",
      data: budget,
    });
  }

  function handleCloseEditModal() {
    setModal(null);
    setAmount(0);
    setAmountInput("");
  }

  async function handleUpdateBudget() {
    if (!budgetPrimary) {
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      const result = await updateBudget({
        id: budgetPrimary.id,
        date: budgetPrimary.date,
        accountId: budgetPrimary.accountId,
        remark: budgetPrimary.remark,
        amount,
      });

      toast.success("Updated", {
        description: result.message,
      });

      handleCloseEditModal();
    } catch (error) {
      toast.error("Failed to update", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-4">
          {/* FILTER DATE PERIOD */}
          <div className="bg-white border border-slate-200 rounded-lg">
            <TransactionComponentFilterDate period={{ start, end, prev, next, isCurrentPeriod, isMaxPeriod }} allowFuture />
          </div>
          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="flex flex-col">
              <div className="flex items-center justify-between p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-400">Budget This Month</span>
                  <span className="text-base font-semibold text-black">{formatBalance(
                    budgetPrimary ? formatCurrency(budgetPrimary.amount) : "-",
                    hideBalance)}
                  </span>
                </div>
                <button
                  onClick={handleOpenEditModal}
                  className="flex items-center px-3 py-2 text-amber-500 text-sm border border-amber-500 hover:bg-amber-500 hover:text-white rounded-lg gap-2 transition cursor-pointer">
                  <NoteEditIcon size={20} />
                  <span className="font-semibold">Edit</span>
                </button>
              </div>
              <button
                onClick={() => navigate(`/budget/create`)}
                className="flex w-full justify-center py-3 bg-black hover:bg-slate-900 text-white text-sm gap-2 transition cursor-pointer">
                <Add01Icon size={20} />
                <span className="font-semibold">Create Budget</span>
              </button>
              <div className="flex flex-col">
                {groupedBudgets.map((budget) => (
                  <div
                    key={budget.accountId}
                    onClick={() => handleOpenTransferModal(budget)}
                    className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <img src={getAccountsImg(budget.accountName)} alt={budget.accountName} className="w-8 h-8" />
                      <span className="text-sm text-slate-600">{budget.accountName}</span>
                    </div>
                    <span className="text-sm text-slate-600">
                      {formatBalance(formatCurrency(budget.total), hideBalance)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Budget Allocation</span>
                    <span className={`text-sm font-semibold ${isOverBudget ? "text-red-500" : "text-green-500"}`}>{isOverBudget ? "Over Budget!" : "Safe Budget"}</span>
                  </div>
                  <span className={`text-sm font-semibold ${isOverBudget ? "text-red-500" : "text-green-500"}`}>{formatBalance(formatCurrency(totalAllocation), hideBalance)}</span>
                </div>
              </div>
            </div >
          </div>
        </div>
        {isEmpty ? (
          <div className="w-full py-12 bg-white border border-slate-200 rounded-lg">
            <EmptyState
              title="No budgets yet"
              subtitle="Create your first budget to start tracking"
              icon={<MoneySavingJarIcon />} />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetDetails.map((item) => {
              const spending = spendingMap.get(item.id) ?? 0;
              const isCappedBudget = item.accountId === "ACC005" && item.remark === "Uang Bersama";
              const displaySpending = isCappedBudget ? Math.min(spending, item.amount) : spending;
              const saving = item.amount - displaySpending;
              const percent =
                item.amount > 0
                  ? Math.round((displaySpending / item.amount) * 100)
                  : 0;

              const isOverBudget = spending > item.amount;
              const accountName = accountLookup[item.accountId ?? ""] ?? "Unknown Account";

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/budget/edit/${item.id}`)}
                  className="bg-white border border-slate-200 hover:bg-slate-100 rounded-lg p-4 flex flex-col transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={getAccountsImg(accountName)}
                        alt={accountName}
                        className="w-8 h-8" />
                      <span className="text-sm font-medium text-slate-500">{accountName}</span>
                    </div>

                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border 
                      ${isOverBudget
                        ? "bg-red-50 text-red-500 border-red-200"
                        : "bg-green-50 text-green-500 border-green-200"
                      }`}>
                      {isOverBudget ? "Over Budget" : "Safe"}
                    </span>
                  </div>
                  <div className="my-3 h-px bg-slate-100" />
                  <div className="flex flex-col gap-4">
                    <div className="text-sm font-semibold text-black truncate">{item.remark}</div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Budgeting</span>
                        <span className="text-xs text-slate-500">{formatBalance(formatCurrency(item.amount), hideBalance)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Spending</span>
                        <span className={`text-xs ${isOverBudget ? "text-red-500 font-semibold" : "text-slate-500"}`}>
                          {formatBalance(formatCurrency(displaySpending), hideBalance)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Saving</span>
                        <span className={`text-xs ${saving < 0 ? "text-red-500 font-semibold" : "text-slate-500"}`}>
                          {formatBalance(formatCurrency(saving), hideBalance)}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isOverBudget ? "bg-red-500" : "bg-green-600"}`}
                          style={{ width: `${Math.min(percent, 100)}%` }} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-[10px] font-bold ${percent > 55 ? "text-white" : "text-black"}`}>{percent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <ComponentBudgetTransferModal
        open={modal?.type === "listTransfer"}
        budget={modal?.type === "listTransfer" ? modal.data : null}
        accounts={accounts}
        hideBalance={hideBalance}
        onClose={() => setModal(null)} />
      <ComponentBudgetEditModal
        open={modal?.type === "editBudget"}
        budget={budgetPrimary}
        amount={amount}
        amountInput={amountInput}
        loading={loading}
        onAmountChange={handleAmountChange}
        onSubmit={handleUpdateBudget}
        onClose={handleCloseEditModal} />
    </>
  )
}

