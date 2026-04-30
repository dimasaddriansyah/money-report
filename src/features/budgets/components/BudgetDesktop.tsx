import { Add01Icon, Delete02Icon, DollarCircleIcon, NoteEditIcon } from "hugeicons-react";
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
  | { type: "delete"; data: Budget }
  | { type: "listTransfer"; data: BudgetGroup }
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

  const { start, end } = useTransactionPeriod(true);
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

  const statusUsageStyleMap =
    percentUsage > 100 ? "bg-red-100 border border-red-200 text-red-600"
      : percentUsage >= 100 ? "bg-blue-100 border border-blue-200 text-blue-600"
        : percentUsage >= 70 ? "bg-yellow-100 border border-yellow-200 text-yellow-600"
          : "bg-green-100 border border-green-200 text-green-600";

  const { deleteBudget, saveBudget, loading } = useBudgetActions(refetch);
  async function handleDelete() {
    if (modal?.type !== "delete") return;
    try {
      const result = await deleteBudget(modal.data.id);
      toast.success("Deleted", {
        description: result.message,
      });
      setModal(null);
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error("Failed to delete", {
        description: message,
      });
    }
  }

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
      {isEmpty ? (
        <EmptyState
          title="No budgets yet"
          subtitle="Create your first budget to start tracking" />
      ) : (
        <>
          <div className="flex gap-4 items-start">
            <div className="w-[70%]">
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <span className="text-base text-black font-medium">List Budget</span>
                  <button
                    onClick={() => navigate(`/budget/create`)}
                    className="flex items-center px-3 py-2 bg-black hover:bg-slate-900 border text-white text-sm rounded-lg gap-2 cursor-pointer">
                    <Add01Icon size={20} />
                    <span className="font-semibold">Add Budget</span>
                  </button>
                </div>
                <div className="flex flex-col">
                  {grouped.map((group) => (
                    <div key={group.accountId}>
                      <div className="flex justify-between px-4 py-3 bg-slate-100">
                        <div className="flex items-center gap-3">
                          <img src={getAccountsImg(group.accountName)} alt={group.accountName} className="w-6 h-6" />
                          <span className="text-sm font-semibold text-slate-500">{group.accountName}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-500">{formatBalance(formatCurrency(group.total), hideBalance)}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
                          <thead className="bg-slate-200 text-sm text-left text-slate-500">
                            <tr>
                              <th className="w-10">#</th>
                              <th className="w-50">Remark</th>
                              <th>Budget</th>
                              <th>Spent</th>
                              <th>Status</th>
                              <th className="w-30 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.budgets.map((b, index) => {
                              const ACCOUNT_USE_CATEGORY = ["ACC005", "ACC006"];
                              const isCategoryBased = ACCOUNT_USE_CATEGORY.includes(group.accountId);
                              const spent = isCategoryBased
                                ? getSpentByBudget(b.remark, b.accountId, transactionMap)
                                : transactionMap.byRemark[b.remark?.toLowerCase() ?? ""] ?? 0;
                              const percent =
                                b.amount > 0
                                  ? Math.min(Math.round((spent / b.amount) * 100), 100)
                                  : 0;
                              const status =
                                percent > 100 ? "Over"
                                  : percent >= 100 ? "Pass"
                                    : percent >= 70 ? "Warning"
                                      : "Safe";
                              const statusStyleMap: Record<string, string> = {
                                Over: "bg-red-100 border border-red-200 text-red-600",
                                Pass: "bg-blue-100 border border-blue-200 text-blue-600",
                                Warning: "bg-yellow-100 border border-yellow-200 text-yellow-600",
                                Safe: "bg-green-100 border border-green-200 text-green-600",
                              };

                              return (
                                <tr key={b.id} className="hover:bg-slate-50">
                                  <td className="text-sm text-slate-400">{index + 1}.</td>
                                  <td className="text-sm">{b.remark}</td>
                                  <td className="text-sm font-semibold">{formatBalance(formatCurrency(b.amount), hideBalance)}</td>
                                  <td className="text-sm text-slate-500">{formatBalance(formatCurrency(spent), hideBalance)}</td>
                                  <td className="text-xs font-medium">
                                    <span className={`px-2 py-1 rounded-full ${statusStyleMap[status]}`}>{status}</span>
                                  </td>
                                  <td className="flex gap-2 text-xs font-medium">
                                    <button
                                      onClick={() => navigate(`/budget/edit/${b.id}`)}
                                      className="p-2 bg-amber-50 hover:bg-amber-200 rounded-xl cursor-pointer">
                                      <NoteEditIcon size={20} className="text-amber-500" />
                                    </button>
                                    <button
                                      onClick={() => setModal({ type: "delete", data: b })}
                                      className="p-2 bg-red-50 hover:bg-red-200 rounded-xl cursor-pointer">
                                      <Delete02Icon size={20} className="text-red-500" />
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-[30%] space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <span className="text-base text-black font-medium">Budget This Month</span>
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
                    className="flex items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 border text-white text-sm rounded-lg gap-2 cursor-pointer">
                    <NoteEditIcon size={20} />
                    <span className="font-semibold">Edit</span>
                  </button>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-sm text-slate-400">Total Budget</span>
                  <span className="text-base font-semibold">{formatBalance(formatCurrency(budgetPrimary?.amount ?? 0), hideBalance)}</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <span className="text-base font-semibold">List Transfer</span>
                    <div className={`flex px-2 py-1 rounded-full gap-1 ${statusUsageStyleMap}`}>
                      <span className="text-xs font-semibold">{formatBalance(formatCurrency(totalUsage), hideBalance)}</span>
                      <span className="text-xs font-semibold">
                        ({hideBalance ? "••" : percentUsage}%)
                      </span>
                    </div>
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
                  </div>
                </div >
              </div>
            </div>
          </div>
        </>
      )}
      {modal?.type === "delete" && (
        <Modal
          title="Delete Budget"
          textButton="Delete"
          loading={loading}
          onSubmit={handleDelete}
          onClose={() => setModal(null)}>
          <p className="p-4 text-sm text-slate-500">
            Delete <span className="text-black font-semibold">"{modal.data.remark}"</span> ? This cannot be undone.
          </p>
        </Modal>
      )}
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

