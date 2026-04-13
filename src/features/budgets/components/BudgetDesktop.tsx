import { Delete02Icon, NoteEditIcon } from "hugeicons-react";
import EmptyState from "../../../shared/ui/EmptyState";
import { usePagination } from "../../../shared/hooks/usePagination";
import TablePageSize from "../../../shared/ui/tables/TablePageSize";
import TablePagination from "../../../shared/ui/tables/TablePagination";
import type { Budget } from "../types/budget";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import Modal from "../../../components/utils/Modal";
import { useBudgetActions } from "../hooks/useBudgetActions";

export default function BudgetDesktop({ budgets, refetch }: { budgets: Budget[]; refetch: () => void; }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const { deleteBudget, loading } = useBudgetActions(refetch);

  const isEmpty = budgets.length === 0;
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
  } = usePagination<Budget>({ data: budgets });

  async function handleDelete() {
    if (!selectedBudget) return;

    try {
      const result = await deleteBudget(selectedBudget.id);

      toast.success("Deleted", {
        description: result.message,
      });

      setOpen(false);
      setSelectedBudget(null);
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
          title="No budgets yet"
          subtitle="Create your first budget to start tracking"
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
                  <th>Budget Name</th>
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
                        <span className="text-slate-900">{row.remark || "-"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <div
                          onClick={() => navigate(`/budget/edit/${row.id}`)}
                          className="bg-amber-50 hover:bg-amber-200 p-2 rounded-xl cursor-pointer">
                          <NoteEditIcon className="w-5 h-5 text-amber-500" />
                        </div>
                        <div
                          onClick={() => {
                            setSelectedBudget(row);
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
          title="Delete Budget"
          textButton="Delete"
          loading={loading}
          onSubmit={handleDelete}
          onClose={() => {
            setOpen(false);
            setSelectedBudget(null);
          }}
        >
          <p className="text-sm text-slate-500">
            {selectedBudget
              ? `Delete "${selectedBudget.remark}"? This cannot be undone.`
              : ""}
          </p>
        </Modal>
      )}
    </>
  )
}

