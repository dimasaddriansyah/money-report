import { useMemo, useState } from "react";
import EmptyState from "../../../components/utils/EmptyState";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import type { Transaction } from "../../transactions/types/transaction";
import { useTransactionActions } from "../../transactions/hooks/useTransactionActions";
import { toast } from "sonner";
import { getAccountDisplay, getAmountDisplay, getCategoryName, getTypeDisplay } from "../../transactions/utils/ui.helpers";
import { getAccountsImg, getCategoriesImg } from "../../../helpers/UI";
import { Delete02Icon, NoteEditIcon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../shared/ui/Modal";
import { formatBalance, formatDateDay, formatDateDayMonthYear } from "../../../shared/utils/format.helper";
import { useBalance } from "../../../shared/context/BalanceContext";

export default function DashboardSectionRecentTransactions({
  transactions,
  accounts,
  categories,
  refetch }: {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    refetch: () => void;
  }) {
  const navigate = useNavigate();
  const { hideBalance } = useBalance();
  const isEmpty = transactions.length === 0;

  const accountMap = useMemo(
    () => Object.fromEntries(accounts.map(row => [row.id, row.name])),
    [accounts]
  );

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map(row => [row.id, row.name])),
    [categories]
  );

  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { deleteTransaction, loading } = useTransactionActions(refetch);

  async function handleDelete() {
    if (!selectedTransaction) return;

    try {
      const result = await deleteTransaction(selectedTransaction.id);

      toast.success("Deleted", {
        description: result.message,
      });

      setOpen(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      toast.error("Failed to delete", {
        description: error.message,
      });
    }
  }

  return (
    <>
      {isEmpty ? (
        <EmptyState
          title="No transactions yet"
          subtitle="Create your first transaction to start tracking"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="w-12">#</th>
                <th className="">Date</th>
                <th className="">Type</th>
                <th className="">Account</th>
                <th className="">Category</th>
                <th className="w-40 text-right">Nominal</th>
                <th className="w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((row, index) => {
                const typeConfig = getTypeDisplay(row.type);
                const amountConfig = getAmountDisplay(row);
                const categoryName = getCategoryName(row.categoryId, categoryMap);

                return (
                  <tr
                    key={`${row.id}-${index}`}
                    className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="text-slate-500 font-medium">{index + 1}</td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-black font-medium">{formatDateDay(row.date)}</span>
                        <span className="text-slate-400">{formatDateDayMonthYear(row.date) || "-"}</span>
                      </div>
                    </td>
                    <td className="">
                      <span className={`text-xs capitalize ${typeConfig.className}`}>
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="">
                      <div className="flex items-center gap-1">
                        {getAccountDisplay(row, accountMap).map((name, index, arr) => (
                          <span key={index} className="flex items-center gap-2">
                            <img src={getAccountsImg(name)} alt={name} className="w-8 h-8" />
                            <span className="font-medium">{name}</span>
                            {index < arr.length - 1 && (
                              <span className="text-slate-400 px-1.5">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="flex items-center gap-3">
                      <img src={getCategoriesImg(categoryName)} alt={categoryName} className="w-8 h-8" />
                      <div className="flex flex-col">
                        <span className="text-black font-medium">{row.remark || "-"}</span>
                        <span className="text-slate-400">{categoryName}</span>
                      </div>
                    </td>
                    <td className={`text-right ${amountConfig.className}`}>
                      <span className="">{formatBalance(amountConfig.label, hideBalance)}</span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <div
                          onClick={() => navigate(`/transaction/edit/${row.id}`)}
                          className="bg-amber-50 hover:bg-amber-200 p-2 rounded-xl cursor-pointer">
                          <NoteEditIcon className="w-5 h-5 text-amber-500" />
                        </div>
                        <div
                          onClick={() => {
                            setSelectedTransaction(row);
                            setOpen(true);
                          }}
                          className="bg-red-50 hover:bg-red-200 p-2 rounded-xl cursor-pointer">
                          <Delete02Icon className="w-5 h-5 text-red-500" />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {open && (
        <Modal
          title="Delete Transaction"
          loading={loading}
          onSubmit={handleDelete}
          onClose={() => {
            setOpen(false);
            setSelectedTransaction(null);
          }}
        >
          <p className="text-sm text-slate-500">
            {selectedTransaction
              ? `Delete "${selectedTransaction.remark}"? This cannot be undone.`
              : ""}
          </p>
        </Modal>
      )}
    </>
  )
}

