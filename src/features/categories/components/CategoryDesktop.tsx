import { Delete02Icon, NoteEditIcon } from "hugeicons-react";
import EmptyState from "../../../shared/ui/EmptyState";
import TablePageSize from "../../../shared/ui/tables/TablePageSize";
import TablePagination from "../../../shared/ui/tables/TablePagination";
import type { Category } from "../types/category";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { formatDateDayMonthYear } from "../../../shared/utils/format.helper";
import Modal from "../../../shared/ui/Modal";
import { usePagination } from "../../../shared/hooks/usePagination";
import { useState } from "react";
import { getCategoriesImg } from "../../../shared/utils/style.helper";

type Props = {
  categories: Category[];
  refetch: () => void;
};

export default function CategoryDesktop({
  categories,
  refetch
}: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { deleteCategory, loading } = useCategoryActions(refetch);
  const isEmpty = !categories || categories.length === 0;

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
  } = usePagination({ data: categories });

  async function handleDelete() {
    if (!selectedCategory) return;
    try {
      const result = await deleteCategory(selectedCategory.id);
      toast.success("Deleted", {
        description: result.message,
      });
      setOpen(false);
      setSelectedCategory(null);
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
          title="No categories yet"
          subtitle="Create your first category to start tracking"
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <TablePageSize
              pageSize={pageSize}
              onChange={(value) => setPageSize(value)} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="w-12">#</th>
                  <th>Category Name</th>
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
                          src={getCategoriesImg(row.name)}
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
                          onClick={() => navigate(`/category/edit/${row.id}`)}
                          className="bg-amber-50 hover:bg-amber-200 p-2 rounded-xl cursor-pointer">
                          <NoteEditIcon className="w-5 h-5 text-amber-500" />
                        </div>
                        <div
                          onClick={() => {
                            setSelectedCategory(row);
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
            onPageChange={setCurrentPage} />
        </>
      )}
      {open && (
        <Modal
          title="Delete Category"
          textButton="Delete"
          loading={loading}
          onSubmit={handleDelete}
          onClose={() => {
            setOpen(false);
            setSelectedCategory(null);
          }}
        >
          <p className="text-sm text-slate-500">
            {selectedCategory
              ? `Delete "${selectedCategory.name}"? This cannot be undone.`
              : ""}
          </p>
        </Modal>
      )}
    </>
  )
}

