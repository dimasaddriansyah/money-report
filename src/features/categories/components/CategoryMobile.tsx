import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { toast } from "sonner";
import EmptyState from "../../../shared/ui/EmptyState";
import BottomSheet from "../../../shared/ui/BottomSheet";
import ComponentCategoryItem from "./ComponentCategoryItem";
import type { Category } from "../types/category";

export default function CategoryMobile({ categories, refetch }:
  {
    categories: Category[];
    refetch: () => void;
  }) {
  const navigate = useNavigate();

  const isEmpty = categories.length === 0;

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeSwipeId, setActiveSwipeId] = useState<string | null>(null);

  const { deleteCategory, loading } = useCategoryActions(refetch);
  async function handleDelete() {
    if (!selectedCategory) return;
    try {
      const result = await deleteCategory(selectedCategory.id);
      toast.success("Deleted", {
        description: result.message,
      });
      setOpen(false);
      setSelectedCategory(null);
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
        <div className="bg-white">
          {categories.map((row: any) => (
            <ComponentCategoryItem
              key={row.id}
              row={row}
              isOpen={activeSwipeId === row.id}
              onOpen={() => setActiveSwipeId(row.id)}
              onClose={() => setActiveSwipeId(null)}
              onEdit={() => navigate(`/category/edit/${row.id}`)}
              onDelete={() => { setSelectedCategory(row); setOpen(true) }} />
          ))}
        </div>
      )}
      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedCategory(null);
        }}
        title="Delete Category">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500">
            {selectedCategory
              ? `Delete "${selectedCategory.name}"? This cannot be undone.`
              : ""}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setOpen(false);
                setSelectedCategory(null);
              }}
              className="flex-1 py-2 rounded-xl hover:bg-slate-50 border border-slate-200 text-sm text-slate-400 cursor-pointer">
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm text-white font-medium disabled:opacity-50 cursor-pointer">
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}