import { Delete02Icon, NoteEditIcon } from "hugeicons-react";
import EmptyState from "../../../shared/ui/EmptyState";
import { getAccountsImg } from "../../../helpers/UI";
import { usePagination } from "../../../shared/hooks/usePagination";
import TablePageSize from "../../../shared/ui/tables/TablePageSize";
import TablePagination from "../../../shared/ui/tables/TablePagination";
import type { Account } from "../types/account";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import Modal from "../../../components/utils/Modal";
import { useAccountActions } from "../hooks/useAccountActions";
import { formatDateDayMonthYear, formatDateFull } from "../../../shared/utils/format.helper";

export default function AccountDesktop({ accounts, refetch }: { accounts: Account[]; refetch: () => void; }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { deleteAccount, loading } = useAccountActions(refetch);

  const isEmpty = accounts.length === 0;
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
  } = usePagination<Account>({ data: accounts });

  async function handleDelete() {
    if (!selectedAccount) return;

    try {
      const result = await deleteAccount(selectedAccount.id);

      toast.success("Deleted", {
        description: result.message,
      });

      setOpen(false);
      setSelectedAccount(null);
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
          title="No accounts yet"
          subtitle="Create your first account to start tracking"
        />
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
                  <th>Account Name</th>
                  <th>Created Date</th>
                  <th>Updated Date</th>
                  <th className="w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr
                    key={`${row.id}-${index}`}
                    className="border-b border-slate-50 hover:bg-slate-50 transition"
                  >
                    <td className="text-slate-500 font-medium">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="text-slate-500">
                      <div className="flex items-center gap-4">
                        <img
                          src={getAccountsImg(row.name)}
                          alt={row.name}
                          className="w-8 h-8"
                        />
                        <span className="text-slate-900">{row.name || "-"}</span>
                      </div>
                    </td>
                    <td className="text-slate-500">{formatDateDayMonthYear(row.createdAt) || "-"}</td>
                    <td className="text-slate-500">{formatDateDayMonthYear(row.updatedAt) || "-"}</td>
                    <td>
                      <div className="flex gap-2">
                        <div
                          onClick={() => navigate(`/account/edit/${row.id}`)}
                          className="bg-amber-50 hover:bg-amber-200 p-2 rounded-xl cursor-pointer">
                          <NoteEditIcon className="w-5 h-5 text-amber-500" />
                        </div>
                        <div
                          onClick={() => {
                            setSelectedAccount(row);
                            setOpen(true);
                          }}
                          className="bg-red-50 hover:bg-red-200 p-2 rounded-xl cursor-pointer">
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
      {open && (
        <Modal
          title="Delete Account"
          textButton="Delete"
          loading={loading}
          onSubmit={handleDelete}
          onClose={() => {
            setOpen(false);
            setSelectedAccount(null);
          }}
        >
          <p className="text-sm text-slate-500">
            {selectedAccount
              ? `Delete "${selectedAccount.name}"? This cannot be undone.`
              : ""}
          </p>
        </Modal>
      )}
    </>
  )
}

