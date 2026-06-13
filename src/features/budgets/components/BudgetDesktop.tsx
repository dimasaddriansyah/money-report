import { Add01Icon, DollarCircleIcon, MoneySavingJarIcon, NoteEditIcon } from "hugeicons-react";
import { formatBalance, formatCurrency, formatDateMonthRange, formatNumber } from "../../../shared/utils/format.helper";
import type { Account } from "../../accounts/types/account";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import type { Transaction } from "../../transactions/types/transaction";
import type { Budget } from "../types/budget";
import { useBalance } from "../../../shared/context/BalanceContext";
import { useNavigate } from "react-router-dom";
import TransactionComponentFilterDate from "../../transactions/components/TransactionComponentFilterDate";
import { getBudgetByPeriod } from "../utils/getBudgetByPeriod.helper";
import { toast } from "sonner";
import { useState } from "react";
import Modal from "../../../shared/ui/Modal";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { type GroupedBudget, groupBudgetByAccount } from "../utils/groupBudgetByAccount.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import { groupBudgetByOriginalAccount } from "../utils/groupBudgetByOriginalAccount.helper";
import { getBudgetSpendingMap } from "../utils/getBudgetSpendingMap.helper";
import EmptyState from "../../../shared/ui/EmptyState";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  transactions: Transaction[];
  refetch: () => void;
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
  const breakdownAccounts = modal?.type === "listTransfer"
    ? groupBudgetByOriginalAccount(modal.data.items, accounts)
    : [];

  const totalAllocation = groupedBudgets.reduce((sum, budget) => sum + budget.total, 0);
  const budgetAmount = budgetPrimary?.amount ?? 0;
  const isOverBudget = totalAllocation > budgetAmount;

  const accountMap = new Map(
    accounts.map(a => [a.id, a.name])
  );

  const spendingMap = getBudgetSpendingMap(budgetDetails, transactionsInPeriod);

  const isEmpty = groupedBudgets.length === 0;

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = Number(raw);
    setAmount(numeric);
    setAmountInput(formatNumber(numeric));
  }

  return (
    <>
      <div className="flex gap-4 items-start">
        <div className="w-[30%] min-w-78 space-y-4">
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
                  onClick={() => {
                    if (!budgetPrimary?.amount) {
                      toast.error("Budget not found");
                      return;
                    }
                    setAmount(budgetPrimary.amount);
                    setAmountInput(formatNumber(budgetPrimary.amount));
                    setModal({ type: "editBudget", data: budgetPrimary });
                  }}
                  className="flex items-center px-3 py-2 text-amber-500 text-sm border border-amber-500 hover:bg-amber-500 hover:text-white rounded-lg gap-2 transition cursor-pointer">
                  <NoteEditIcon size={20} />
                  <span className="font-semibold">Edit</span>
                </button>
              </div>
              <button
                onClick={() => navigate(`/budget/create`)}
                className="flex w-full justify-center py-3 bg-black hover:bg-slate-900 text-white text-sm gap-2 transition cursor-pointer">
                <Add01Icon size={20} />
                <span className="font-semibold">Add Budget</span>
              </button>
              <div className="flex flex-col">
                {groupedBudgets.map((budget) => (
                  <div
                    key={budget.accountId}
                    onClick={() => setModal({ type: "listTransfer", data: budget })}
                    className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <img src={getAccountsImg(budget.accountName)} alt={budget.accountName} className="w-8 h-8" />
                      <span className="text-sm text-slate-500">{budget.accountName}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatBalance(formatCurrency(budget.total), hideBalance)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-100">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 font-medium">Total Allocation</span>
                    {isOverBudget && (
                      <span className="text-sm font-semibold text-red-500">Over Budget!</span>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${isOverBudget ? "text-red-500" : "text-black"}`}>{formatBalance(formatCurrency(totalAllocation), hideBalance)}</span>
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
          <div className="w-[70%]">
            <div className="grid grid-cols-3 gap-4">
              {budgetDetails.map((item) => {
                const spending = spendingMap.get(item.id) ?? 0;
                const saving = item.amount - spending;
                const percent =
                  item.amount > 0
                    ? Math.round((spending / item.amount) * 100)
                    : 0;
                const isOverBudget = spending > item.amount;
                const accountName = accountMap.get(item.accountId) ?? "Unknown Account";

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
                            {formatBalance(formatCurrency(spending), hideBalance)}
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
                        <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isOverBudget ? "bg-red-500" : "bg-black"}`}
                            style={{ width: `${Math.min(percent, 100)}%` }} />
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">{percent}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      {modal?.type === "listTransfer" && (
        <Modal
          title={`List Transfer ${modal.data.accountName}`}
          onClose={() => setModal(null)}>
          <div className="flex flex-col">
            {breakdownAccounts.map((item) => (
              <div
                key={item.accountId}
                className="flex items-center justify-between px-4 py-3 text-sm border-b border-slate-50 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <img
                    src={getAccountsImg(item.accountName)}
                    alt={item.accountName}
                    className="w-8 h-8" />
                  <span className="text-slate-500">{item.accountName}</span>
                </div>
                <span className="font-medium text-slate-500">
                  {formatBalance(formatCurrency(item.total), hideBalance)}
                </span>
              </div>
            ))}
            <div className="flex justify-between bg-slate-50 p-4 text-sm font-semibold">
              <span>Total</span>
              <span>{formatBalance(formatCurrency(modal.data.total), hideBalance)}</span>
            </div>
          </div>
        </Modal>
      )}
      {modal?.type === "editBudget" && (
        <Modal
          title={`Edit Budget ${budgetPrimary ? formatDateMonthRange(budgetPrimary.date) : ""}`}
          textButton="Update"
          loading={loading}
          onSubmit={async () => {
            if (!budgetPrimary) return;
            if (!amount || amount <= 0) {
              toast.error("Amount must be greater than 0");
              return;
            }
            try {
              const result = await saveBudget({
                id: budgetPrimary.id,
                date: budgetPrimary.date,
                remark: budgetPrimary.remark,
                amount,
              });
              toast.success("Updated", { description: result.message });
              setModal(null);
            } catch (error: unknown) {
              let message = "Something went wrong";
              if (error instanceof Error) {
                message = error.message;
              }
              toast.error("Failed to update", {
                description: message,
              });
            }
          }}
          onClose={() => {
            setModal(null);
            setAmount(0);
            setAmountInput("");
          }}>
          <div id="amount" className="flex-1 p-4">
            <label className="block text-sm font-medium text-black mb-1">Amount</label>
            <div className="relative flex items-center justify-center">
              <div className="absolute left-4 pointer-events-none">
                <DollarCircleIcon className="text-slate-400" size={20} />
              </div>
              <input
                inputMode="numeric"
                value={amountInput}
                onChange={handleAmountChange}
                className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${amount ? "text-black" : "text-slate-400"} border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
                placeholder="Input transaction amount" />
            </div>
          </div>
        </Modal >
      )}
    </>
  )
}

