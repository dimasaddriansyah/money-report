import { Delete02Icon, InvoiceIcon, NoteEditIcon, PlusSignIcon } from "hugeicons-react";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import DesktopLayout from "../../components/utils/DesktopLayout";
import HeaderDesktop from "../../components/utils/HeaderDesktop";
import MobileLayout from "../../components/utils/MobileLayout";
import FooterDesktop from "../../components/utils/FooterDesktop";
import { useTransactions } from "../../hooks/transactions/useTransactions";
import EmptyState from "../../components/utils/EmptyState";
import { formatRupiah, smartCapitalize } from "../../helpers/Format";
import { getAccountsImg, getCategoriesImg } from "../../helpers/UI";
import { useLocalStorage } from "../../hooks/utils/useLocalStorage";
import { useState } from "react";
import TablePagination from "../../components/tables/TablePagination";
import TablePageSize from "../../components/tables/TablePageSize";
import { usePagination } from "../../hooks/utils/usePagination";

export default function Transactions() {
  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false);

  const { transactions } = useTransactions();
  const isEmpty = transactions.length === 0;

  const sortedTransactions = transactions
    .slice()
    .sort((a, b) => b.transaction_id.localeCompare(a.transaction_id));

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    paginatedData,
    startItem,
    endItem,
    pages,
  } = usePagination({ data: sortedTransactions });


  return (
    <div>
      {/* DESKTOP */}
      <DesktopLayout>
        {/* HEADER */}
        {({ collapsed, setCollapsed }: any) => (
          <>
            {/* HEADER */}
            <HeaderDesktop
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              hideBalance={hideBalance}
              setHideBalance={setHideBalance}
              showBalanceToggle={true}
            />

            {/* CONTENT */}
            <div className="flex flex-col flex-1 overflow-y-auto px-6 py-8 gap-6">
              {/* ROW 1 */}
              <Breadcrumbs
                items={[
                  { label: "Dashboard", path: "/" },
                  { label: "Transactions" },
                ]} />

              {/* ROW 2 */}
              <div className="flex-1">
                <div className="flex flex-col bg-white p-4 rounded-lg gap-4">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-lg">List of Transaction</h1>
                    <button className="flex items-center px-4 py-2 gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg cursor-pointer">
                      <PlusSignIcon size={16} />
                      <span>Add Transaction</span>
                    </button>
                  </div>
                  <div className="h-px bg-slate-100/60" />
                  {isEmpty ? (
                    <EmptyState icon={<InvoiceIcon />} title="No transactions yet" subtitle="Add your first transaction to start tracking your cash flow." />
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <TablePageSize
                          pageSize={pageSize}
                          onChange={(value) => {
                            setPageSize(value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
                          <thead className="bg-slate-50">
                            <tr className="text-left text-slate-500 border-b border-slate-100">
                              <th className="w-12">#</th>
                              <th className="w-43">Date</th>
                              <th className="w-20">Type</th>
                              <th className="w-50">Account</th>
                              <th>Category</th>
                              <th className="w-24 text-right">Amount</th>
                              <th className="w-12 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.map((row, index) => (
                              <tr
                                key={row.transaction_id}
                                className="border-b border-slate-50 hover:bg-slate-50 transition"
                              >
                                <td className="text-slate-500 font-medium">{(currentPage - 1) * pageSize + index + 1}</td>
                                <td className=" text-slate-500">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-slate-900">{row.day || "-"}</span>
                                    <span className="text-slate-500">{row.date || "-"} </span>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex flex-col">
                                    <span className={`w-fit px-2 py-1 text-xs font-medium rounded-full
                                      ${row.type === "expenses" ? "bg-red-50 text-red-500"
                                        : row.type === "income" ? "bg-green-50 text-green-500"
                                          : "bg-slate-50 text-slate-500"}`}>
                                      {smartCapitalize(row.type) || "-"}
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex flex-col">
                                    {(() => {
                                      const account =
                                        row.type === "expenses"
                                          ? row.from_account
                                          : row.type === "income"
                                            ? row.to_account
                                            : row.from_account;

                                      return (
                                        <span className="flex items-center gap-3 text-slate-900 font-medium">
                                          <img
                                            src={getAccountsImg(account)}
                                            alt={account}
                                            className="w-8 h-8"
                                          />
                                          {account}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                </td>
                                <td>
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={getCategoriesImg(row.category)}
                                      alt={row.category}
                                      className="w-8 h-8"
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-slate-900 font-medium">{row.category || "-"}</span>
                                      <span className="text-slate-500">{row.remark || "-"}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className={`text-right font-semibold
                                  ${row.type === "expenses" ? "text-red-500"
                                    : row.type === "income" ? "text-green-500"
                                      : "text-slate-500"}`}>
                                  {hideBalance ? "Rp ••••••" : formatRupiah(row.nominal)}
                                </td>
                                <td>
                                  <div className="flex justify-center gap-2">
                                    <div className="bg-amber-50 hover:bg-amber-200 p-2 rounded-xl cursor-pointer">
                                      <NoteEditIcon className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="bg-red-50 hover:bg-red-200 p-2 rounded-xl cursor-pointer">
                                      <Delete02Icon className="w-5 h-5 text-red-500" />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startItem={startItem}
                        endItem={endItem}
                        pages={pages}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <FooterDesktop />
          </>
        )}
      </DesktopLayout>

      {/* MOBILE */}
      <MobileLayout>
      </MobileLayout>
    </div>
  );
}
