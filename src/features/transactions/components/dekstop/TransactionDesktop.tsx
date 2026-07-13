import { useNavigate } from "react-router-dom";
import type { Account } from "../../../accounts/types/account";
import type { Category } from "../../../categories/types/category";
import type { Transaction } from "../../types/transaction";
import { useBalance } from "../../../../shared/context/BalanceContext";
import { useEffect, useRef, useState } from "react";
import type { DateFilter } from "../../../../shared/utils/dateFilter.helper";
import { useTransactionFilter } from "../../hooks/useTransactionFilter";
import { useTransactionActions } from "../../hooks/useTransactionActions";
import { toast } from "sonner";
import EmptyState from "../../../../shared/ui/EmptyState";
import TablePageSize from "../../../../shared/ui/tables/TablePageSize";
import { ArrowDown01Icon, Calendar03Icon, CreditCardIcon, Note05Icon, Search01Icon } from "hugeicons-react";
import { getAccountsImg, getCategoriesImg } from "../../../../shared/utils/style.helper";
import TransactionTable from "./TransactionTable";
import TransactionPagination from "./TransactionPagination";
import TransactionDeleteModal from "./TransactionDeleteModal";
import { useTransactionPagination } from "../../hooks/useTransactionPagination";
import { useSortedTransactions } from "../../hooks/useSortedTransactions";

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  refetch: () => Promise<void>;
}

export default function TransactionDesktop({
  transactions,
  accounts,
  categories,
  refetch
}: Props) {
  const navigate = useNavigate();
  const { hideBalance } = useBalance();
  const isEmpty = transactions.length === 0;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [openFilterDate, setOpenFilterDate] = useState(false);
  const [openFilterAccount, setOpenFilterAccount] = useState(false);
  const [openFilterCategory, setOpenFilterCategory] = useState(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const dateOptions: {
    label: string;
    value: DateFilter;
  }[] = [
      { label: "All Date", value: null },
      { label: "Today", value: "today" },
      { label: "Yesterday", value: "yesterday" },
      { label: "Last Week", value: "last_week" },
      { label: "Last Month", value: "last_month" },
      { label: "Last Year", value: "last_year" },
    ];

  const { filteredTransactions, accountLookup, categoryLookup, search, setSearch,
    selectedAccount, setSelectedAccount, selectedCategory, setSelectedCategory,
    selectedDate, setSelectedDate } = useTransactionFilter({
      transactions,
      accounts,
      categories,
    });

  const sortedTransactions = useSortedTransactions(filteredTransactions);

  const { paginatedTransactions, totalItems, totalPages, startItem, endItem, pages, } = useTransactionPagination({
    transactions: sortedTransactions,
    page,
    limit
  });

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

  useEffect(() => {
    setPage(1);
  }, [
    search,
    selectedDate,
    selectedAccount,
    selectedCategory,
  ]);

  return (
    <>
      {isEmpty ? (
        <EmptyState
          title="No transactions yet"
          subtitle="Create your first transaction to start tracking" />
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            {/* Show Data Entries  */}
            <TablePageSize
              pageSize={limit}
              onChange={(value) => {
                setLimit(value);
                setPage(1);
              }} />
            {/* Filter Dates  */}
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <span className="text-slate-500 text-xs">Dates</span>
              <div ref={dateRef} className="relative">
                <button
                  onClick={() => {
                    setOpenFilterDate(prev => !prev)
                    setOpenFilterAccount(false)
                    setOpenFilterCategory(false)
                  }}
                  className="flex items-center justify-between w-full p-3 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Calendar03Icon className="text-slate-400" size={16} />
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
            {/* Filter Accounts  */}
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <span className="text-slate-500 text-xs">Accounts</span>
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => {
                    setOpenFilterAccount(prev => !prev)
                    setOpenFilterDate(false)
                    setOpenFilterCategory(false)
                  }}
                  className="flex items-center justify-between w-full p-3 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
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
            {/* Filter Categories  */}
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <span className="text-slate-500 text-xs">Categories</span>
              <div ref={categoryRef} className="relative">
                <button
                  onClick={() => {
                    setOpenFilterCategory(prev => !prev)
                    setOpenFilterDate(false)
                    setOpenFilterAccount(false)
                  }}
                  className="flex items-center justify-between w-full p-3 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Note05Icon className="text-slate-400" size={16} />
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
            {/* Filter Search  */}
            <div className="flex flex-col gap-1 flex-1 min-w-40">
              <span className="text-slate-500 text-xs">Search</span>
              <div className="flex items-center gap-3 w-full p-3 rounded-lg border border-slate-200 focus-within:border-slate-400 transition">
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
          <TransactionTable
            transactions={paginatedTransactions}
            page={page}
            limit={limit}
            accountLookup={accountLookup}
            categoryLookup={categoryLookup}
            hideBalance={hideBalance}
            onEdit={(id) => navigate(`/transaction/edit/${id}`)}
            onDelete={(transaction) => {
              setSelectedTransaction(transaction);
              setOpen(true);
            }} />
          <TransactionPagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            startItem={startItem}
            endItem={endItem}
            pages={pages}
            onPageChange={setPage} />
        </>
      )}
      <TransactionDeleteModal
        open={open}
        loading={loading}
        transaction={selectedTransaction}
        onDelete={handleDelete}
        onClose={() => {
          setOpen(false);
          setSelectedTransaction(null);
        }} />
    </>
  )
}