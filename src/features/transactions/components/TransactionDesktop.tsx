import { Delete02Icon, NoteEditIcon } from "hugeicons-react";
import EmptyState from "../../../shared/ui/EmptyState";
import TablePagination from "../../../shared/ui/tables/TablePagination";
import type { Transaction } from "../types/transaction";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTransactionActions } from "../hooks/useTransactionActions";
import { getAccountDisplay, getAmountDisplay, getCategoryName, getTypeDisplay } from "../utils/ui.helpers";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import { getAccountsImg, getCategoriesImg } from "../../../helpers/UI";
import Modal from "../../../shared/ui/Modal";
import { formatBalance, formatDateDayMonthYear } from "../../../shared/utils/format.helper";
import { useBalance } from "../../../shared/context/BalanceContext";
import TablePageSize from "../../../shared/ui/tables/TablePageSize";

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  refetch: () => void;
}

export default function TransactionDesktop({
  transactions,
  accounts,
  categories,
  refetch
}: Props) {
  const navigate = useNavigate();
  const { hideBalance } = useBalance();
  const isEmpty = !transactions || transactions.length === 0;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions]);

  const totalItems = sortedTransactions.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);
  
  const pages = useMemo(() => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      } else if (
        i === page - delta - 1 ||
        i === page + delta + 1
      ) {
        range.push("...");
      }
    }

    return range;
  }, [page, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return sortedTransactions.slice(start, end);
  }, [sortedTransactions, page, limit]);

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

  return (
    <>
      {isEmpty ? (
        <EmptyState
          title="No transactions yet"
          subtitle="Create your first transaction to start tracking" />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <TablePageSize
              pageSize={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
            />
          </div>
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
                {paginatedTransactions.map((row, index) => {
                  const typeConfig = getTypeDisplay(row.typeId);
                  const Icon = typeConfig.icon;
                  const amountConfig = getAmountDisplay(row);
                  const categoryName = getCategoryName(row.categoryId, categoryMap);

                  return (
                    <tr
                      key={`${row.id}-${index}`}
                      className="border-b border-slate-50 hover:bg-slate-50 transition">
                      <td className="text-slate-500 font-medium">{(page - 1) * limit + index + 1}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-black font-medium">{row.day}</span>
                          <span className="text-slate-400">{formatDateDayMonthYear(row.date) || "-"}</span>
                        </div>
                      </td>
                      <td className="">
                        <div className={`flex w-fit text-xs capitalize gap-1 ${typeConfig.className}`}>
                          <span><Icon size={16} /></span>
                          <span>{typeConfig.label}</span>
                        </div>
                      </td>
                      <td className="">
                        <div className="flex flex-col gap-1.5">
                          {getAccountDisplay(row, accountMap).map((name, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              {index > 0 && (<span className="text-slate-400">→</span>)}
                              <img src={getAccountsImg(name)} alt={name} className="w-8 h-8" />
                              <span className="font-medium">{name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="flex items-center gap-3.5">
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
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            startItem={startItem}
            endItem={endItem}
            pages={pages}
            onPageChange={setPage} />
        </>
      )}
      {open && (
        <Modal
          title="Delete Transaction"
          textButton="Delete"
          loading={loading}
          onSubmit={handleDelete}
          onClose={() => {
            setOpen(false);
            setSelectedTransaction(null);
          }}>
          <p className="text-sm text-slate-500">
            {selectedTransaction ? `Delete "${selectedTransaction.remark}"? This cannot be undone.` : ""}
          </p>
        </Modal>
      )}
    </>
  )
}

