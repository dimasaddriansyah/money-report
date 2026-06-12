import { Add01Icon, DollarCircleIcon, MoneySavingJarIcon, NoteEditIcon } from "hugeicons-react";
import EmptyState from "../../../shared/ui/EmptyState";
import { formatBalance, formatCurrency, formatNumber } from "../../../shared/utils/format.helper";
import type { Account } from "../../accounts/types/account";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import type { Transaction } from "../../transactions/types/transaction";
import { useBudgetGetBudget } from "../hooks/useBudgetGetBudget";
import { useBudgetGroupedByAccount } from "../hooks/useBudgetGroupedByAccount";
import type { Budget } from "../types/budget";
import { getTransactionMap } from "../utils/getTransactionMap.helper";
import { useBalance } from "../../../shared/context/BalanceContext";
import { groupBudgetByAccount } from "../utils/groupBudgetByAccount.helper";
import { useState } from "react";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import { getSpentByBudget } from "../utils/getSpentByBudget.helper";
import { useNavigate } from "react-router-dom";
import Modal from "../../../shared/ui/Modal";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { toast } from "sonner";
import TransactionComponentFilterDate from "../../transactions/components/TransactionComponentFilterDate";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  transactions: Transaction[];
  refetch: () => void;
};

type BudgetGroup = {
  accountId: string;
  accountName: string;
  total: number;
  color?: string;
  items?: BudgetGroup[];
};

type ModalState =
  { type: "listTransfer"; data: BudgetGroup }
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
  const [modal, setModal] = useState<ModalState>(null);

  const { start, end, prev, next, isCurrentPeriod, isMaxPeriod } = useTransactionPeriod(true);
  const grouped = useBudgetGroupedByAccount({ budgets, start, end, accounts });

  const isEmpty = grouped.length === 0;

  const groupedFinal = groupBudgetByAccount(grouped);

  const budgetPrimary = useBudgetGetBudget({ budgets, start })
  const transactionMap = getTransactionMap(transactions, start);

  const [amount, setAmount] = useState(0);
  const [amountInput, setAmountInput] = useState("");

  const totalUsage = grouped.reduce((sum, g) => sum + g.total, 0);
  const percentUsage =
    budgetPrimary?.amount
      ? Math.min(Math.round((totalUsage / budgetPrimary.amount) * 100))
      : 0

  const { saveBudget, loading } = useBudgetActions(refetch);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    const numeric = Number(raw);

    setAmount(numeric);
    setAmountInput(formatNumber(numeric));
  }

  function formatDateMonthRange(value: string) {
    const date = new Date(value);

    const currentMonth = date.toLocaleDateString("en-GB", {
      month: "long",
    });

    const nextDate = new Date(date);
    nextDate.setMonth(date.getMonth() + 1);

    const nextMonth = nextDate.toLocaleDateString("en-GB", {
      month: "long",
    });

    return `${currentMonth} - ${nextMonth}`;
  }

  return (
    <>
      <div className="flex gap-4 items-start">
        <div className="w-[30%] min-w-78 space-y-4">
          {/* FILTER DATE PERIOD */}
          <div className="bg-white border border-slate-200 rounded-lg">
            <TransactionComponentFilterDate period={{ start, end, prev, next, isCurrentPeriod, isMaxPeriod }} allowFuture />
          </div>
          {/* BUTTON ADD BUDGET */}
          <button
            onClick={() => navigate(`/budget/create`)}
            className="flex w-full justify-center py-3 bg-black hover:bg-slate-900 text-white text-sm rounded-lg gap-2 cursor-pointer">
            <Add01Icon size={20} />
            <span className="font-semibold">Add Budget</span>
          </button>
          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-400">Budget This Month</span>
                  <span className="text-base font-semibold text-black">{formatBalance(formatCurrency(budgetPrimary?.amount ?? 0), hideBalance)}</span>
                </div>
                <button
                  onClick={() => {
                    if (!budgetPrimary) {
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
              <div className="flex flex-col">
                {groupedFinal.map((budget) => (
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
                    {totalUsage > (budgetPrimary?.amount ?? 0) && (
                      <span className="text-sm font-semibold text-red-500">Over Budget!</span>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${percentUsage > 100 ? "text-red-500" : "text-black"}`}>{formatBalance(formatCurrency(totalUsage), hideBalance)}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {grouped.flatMap((group) =>
                group.budgets.map((b) => {
                  const ACCOUNT_USE_CATEGORY = ["ACC005", "ACC006"];
                  const isCategoryBased =
                    ACCOUNT_USE_CATEGORY.includes(group.accountId);
                  const spent = isCategoryBased
                    ? getSpentByBudget(
                      b.remark,
                      b.accountId,
                      transactionMap
                    )
                    : transactionMap.byRemark[
                    b.remark?.toLowerCase() ?? ""
                    ] ?? 0;
                  const saving = b.amount - spent;
                  const percent =
                    b.amount > 0
                      ? Math.min(
                        Math.round((spent / b.amount) * 100),
                        100
                      )
                      : 0;
                  const status =
                    percent > 100
                      ? "Over"
                      : percent >= 100
                        ? "Pass"
                        : percent >= 70
                          ? "Warning"
                          : "Safe";
                  const statusStyleMap: Record<string, string> = {
                    Over:
                      "bg-red-100 border border-red-200 text-red-600",
                    Pass:
                      "bg-blue-100 border border-blue-200 text-blue-600",
                    Warning:
                      "bg-yellow-100 border border-yellow-200 text-yellow-600",
                    Safe:
                      "bg-green-100 border border-green-200 text-green-600",
                  };

                  return (
                    <div
                      key={b.id}
                      onClick={() =>
                        navigate(`/budget/edit/${b.id}`)
                      }
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={getAccountsImg(group.accountName)}
                            alt={group.accountName}
                            className="w-6 h-6" />
                          <div className="text-sm font-semibold text-slate-500">{group.accountName}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyleMap[status]}`}>
                          {status}
                        </span>
                      </div>
                      <div className="my-3 h-px bg-slate-100" />
                      <div className="space-y-4">
                        <div className="text-base font-semibold text-black truncate">{b.remark}</div>
                        {/* ALLOCATION */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Budgeting</span>
                            <span className="text-slate-500">{formatBalance(formatCurrency(b.amount), hideBalance)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Spending</span>
                            <span className="text-slate-500">{formatBalance(formatCurrency(spent), hideBalance)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Saving</span>
                            <span className="text-slate-500">{formatBalance(formatCurrency(saving), hideBalance)}</span>
                          </div>
                        </div>
                        {/* USAGE PERCENTAGE */}
                        <div className="relative">
                          <div className="h-4.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-black"
                              style={{ width: `${Math.min(percent, 100)}%`, }} />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-[10px] font-bold ${percent > 50 ? "text-white" : "text-black"}`}>
                              {percent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
      {modal?.type === "listTransfer" && (
        <Modal
          title={`List Transfer ${modal.data.accountName}`}
          onClose={() => setModal(null)}>
          <div className="flex flex-col">
            {modal.data.items?.length ? (
              <>
                {modal.data.items
                  .slice()
                  .sort((a, b) => b.total - a.total)
                  .map((item) => (
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
              </>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-4">
                    <img
                      src={getAccountsImg(modal.data.accountName)}
                      alt={modal.data.accountName}
                      className="w-8 h-8" />
                    <span className="text-slate-500">{modal.data.accountName}</span>
                  </div>
                  <span className="font-medium text-slate-500">
                    {formatBalance(formatCurrency(modal.data.total), hideBalance)}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-50 p-4 text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatBalance(formatCurrency(modal.data.total), hideBalance)}</span>
                </div>
              </>
            )}
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
      )
      }
    </>
  )
}

