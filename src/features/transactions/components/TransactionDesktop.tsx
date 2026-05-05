import { ArrowDown01Icon, Calendar01Icon, CreditCardIcon, Delete02Icon, NoteEditIcon, Search01Icon } from "hugeicons-react";
import EmptyState from "../../../shared/ui/EmptyState";
import TablePagination from "../../../shared/ui/tables/TablePagination";
import type { Transaction } from "../types/transaction";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useTransactionActions } from "../hooks/useTransactionActions";
import { getAccountDisplay, getAmountDisplay, getCategoryName, getTypeDisplay } from "../utils/ui.helpers";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import Modal from "../../../shared/ui/Modal";
import { formatBalance, formatDateDayMonthYear } from "../../../shared/utils/format.helper";
import { useBalance } from "../../../shared/context/BalanceContext";
import TablePageSize from "../../../shared/ui/tables/TablePageSize";
import { getAccountsImg, getCategoriesImg } from "../../../shared/utils/style.helper";

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

  const dateRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [openFilterAccount, setOpenFilterAccount] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openFilterCategory, setOpenFilterCategory] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [openFilterDate, setOpenFilterDate] = useState(false);

  const [search, setSearch] = useState("");

  const dateOptions = [
    { label: "All Date", value: null },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last Week", value: "last_week" },
    { label: "Last Month", value: "last_month" },
    { label: "Last Year", value: "last_year" },
  ];

  const accountMap = useMemo(
    () => Object.fromEntries(accounts.map(row => [row.id, row.name])),
    [accounts]
  );

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map(row => [row.id, row.name])),
    [categories]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((trx) => {
      const accountNames = getAccountDisplay(trx, accountMap);
      const matchAccount =
        !selectedAccount || accountNames.includes(selectedAccount);

      const categoryName = getCategoryName(trx.categoryId, categoryMap);
      const matchCategory =
        !selectedCategory || categoryName === selectedCategory;

      const matchSearch =
        !search ||
        (trx.remark || "").toLowerCase().includes(search.toLowerCase());

      const matchDate = (() => {
        if (!selectedDate) return true;

        const trxDate = new Date(trx.date);
        const now = new Date();
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        switch (selectedDate) {
          case "today":
            return trxDate >= startOfToday;

          case "yesterday": {
            const start = new Date(startOfToday);
            start.setDate(start.getDate() - 1);
            return trxDate >= start && trxDate < startOfToday;
          }

          case "last_week": {
            const start = new Date(startOfToday);
            start.setDate(start.getDate() - 7);
            return trxDate >= start;
          }

          case "last_month": {
            const start = new Date(startOfToday);
            start.setMonth(start.getMonth() - 1);
            return trxDate >= start;
          }

          case "last_year": {
            const start = new Date(startOfToday);
            start.setFullYear(start.getFullYear() - 1);
            return trxDate >= start;
          }

          default:
            return true;
        }
      })();

      return matchAccount && matchCategory && matchDate && matchSearch;
    });
  }, [transactions, selectedAccount, selectedCategory, selectedDate, search, accountMap, categoryMap]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) =>
      b.id.localeCompare(a.id)
    );
  }, [filteredTransactions]);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (dateRef.current && !dateRef.current.contains(target)) {
        setOpenFilterDate(false);
      }

      if (accountRef.current && !accountRef.current.contains(target)) {
        setOpenFilterAccount(false);
      }

      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setOpenFilterCategory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isEmpty ? (
        <EmptyState
          title="No transactions yet"
          subtitle="Create your first transaction to start tracking" />
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <TablePageSize
              pageSize={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }} />
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <span className="text-slate-500 text-xs">Dates</span>
              <div ref={dateRef} className="relative">
                <button
                  onClick={() => {
                    setOpenFilterDate(prev => !prev)
                    setOpenFilterAccount(false)
                    setOpenFilterCategory(false)
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Calendar01Icon className="text-slate-400" size={16} />
                    <span className={`text-sm ${!selectedDate ? "text-slate-500" : "text-black"}`}>
                      {dateOptions.find(d => d.value === selectedDate)?.label || "All Dates"}
                    </span>
                  </div>
                  <ArrowDown01Icon className="text-slate-400" size={16} />
                </button>
                {openFilterDate && (
                  <div className="absolute z-10 mt-2 w-60 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    {dateOptions.map((item) => {
                      const isSelected = selectedDate === item.value;

                      return (
                        <div
                          key={item.label}
                          onClick={() => {
                            setSelectedDate(item.value);
                            setOpenFilterDate(false);
                          }}
                          className={`px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                            ${isSelected ? "bg-slate-100 font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                          {item.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <span className="text-slate-500 text-xs">Accounts</span>
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => {
                    setOpenFilterAccount(prev => !prev)
                    setOpenFilterDate(false)
                    setOpenFilterCategory(false)
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="text-slate-400" size={16} />
                    <span className={`text-sm ${!selectedAccount ? "text-slate-400" : "text-black"}`}>
                      {selectedAccount || "All Accounts"}
                    </span>
                  </div>
                  <ArrowDown01Icon className="text-slate-400" size={16} />
                </button>
                {openFilterAccount && (
                  <div className="absolute z-10 mt-2 w-60 h-60 bg-white border border-slate-200 rounded-lg shadow-sm overflow-y-auto">
                    <div
                      onClick={() => {
                        setSelectedAccount(null)
                        setOpenFilterAccount(false)
                      }}
                      className={`px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                        ${!selectedAccount ? "bg-slate-100 font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                      <span>All Accounts</span>
                    </div>
                    {accounts.map((acc) => {
                      const isSelected = selectedAccount === acc.name;
                      return (
                        <div
                          key={acc.id}
                          onClick={() => {
                            setSelectedAccount(acc.name)
                            setOpenFilterAccount(false)
                          }}
                          className={`flex items-center gap-4 px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                          ${isSelected ? "bg-slate-100 font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                          <img src={getAccountsImg(acc.name)} className="w-6 h-6" />
                          <span>{acc.name}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <span className="text-slate-500 text-xs">Categories</span>
              <div ref={categoryRef} className="relative">
                <button
                  onClick={() => {
                    setOpenFilterCategory(prev => !prev)
                    setOpenFilterDate(false)
                    setOpenFilterAccount(false)
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="text-slate-400" size={16} />
                    <span className={`text-sm ${!selectedCategory ? "text-slate-400" : "text-black"}`}>
                      {selectedCategory || "All Categories"}
                    </span>
                  </div>
                  <ArrowDown01Icon className="text-slate-400" size={16} />
                </button>
                {openFilterCategory && (
                  <div className="absolute z-10 mt-2 w-60 h-60 bg-white border border-slate-200 rounded-lg shadow-sm overflow-y-auto">
                    <div
                      onClick={() => {
                        setSelectedCategory(null)
                        setOpenFilterCategory(false)
                      }}
                      className={`px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                        ${!selectedCategory ? "bg-slate-100 font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                      <span>All Categories</span>
                    </div>
                    {categories.map((row) => {
                      const isSelected = selectedCategory === row.name;
                      return (
                        <div
                          key={row.id}
                          onClick={() => {
                            setSelectedCategory(row.name)
                            setOpenFilterCategory(false)
                          }}
                          className={`flex items-center gap-4 px-4 py-3 text-sm border-b border-slate-50 cursor-pointer
                          ${isSelected ? "bg-slate-100 font-medium" : "text-slate-400 hover:bg-slate-50"}`}>
                          <img src={getCategoriesImg(row.name)} className="w-6 h-6" />
                          <span>{row.name}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <span className="text-slate-500 text-xs">Search</span>
              <div className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-slate-200 focus-within:border-slate-400 transition">
                <Search01Icon className="text-slate-400" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search transaction..."
                  className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="w-12">#</th>
                  <th className="">Date</th>
                  <th className="">Account</th>
                  <th className="">Category</th>
                  <th className="w-40 text-right">Nominal</th>
                  <th className="w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((row, index) => {
                  const typeConfig = getTypeDisplay(row.typeId);
                  const amountConfig = getAmountDisplay(row);
                  const categoryName = getCategoryName(row.categoryId, categoryMap);
                  const isSpecialRemark = /\[.*?\]/.test(row.remark || "");

                  return (
                    <tr
                      key={`${row.id}-${index}`}
                      className={`${isSpecialRemark ? "bg-red-50" : "bg-white"} border-b border-slate-50 hover:bg-slate-50 transition`}>
                      <td className="text-slate-500 font-medium">{(page - 1) * limit + index + 1}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-black font-medium">{row.day}</span>
                          <span className="text-slate-400">{formatDateDayMonthYear(row.date) || "-"}</span>
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
                        <div className={`text-xs capitalize gap-1 ${typeConfig.className}`}>
                          <span>{typeConfig.label}</span>
                        </div>
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

