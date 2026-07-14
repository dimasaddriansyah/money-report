import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "../components/CategoryForm";
import CategoryLayout from "../components/CategoryLayout";
import { useCategories } from "../hooks/useCategories";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { toast } from "sonner";
import type { FormData } from "../utils/category.form.helper";

export default function CategoryEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories, loading: isFetchingCategories } = useCategories();
  const { updateCategory, loading } = useCategoryActions();
  const category = categories.find((acc) => acc.id === id);

  async function handleSubmit(data: FormData) {
    try {
      const result = await updateCategory(data);
      navigate("/categories")
      toast.success("Success", {
        description: result.message,
      });
    } catch (error: unknown) {
      let message = "Failed to save category";
      if (error instanceof Error) { message = error.message }
      toast.error("Failed to save category", {
        description: message,
        duration: 2000,
      });
    }
  }

  if (isFetchingCategories) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading categories...</span>
      </div>
    );
  }

  if (!category && categories.length > 0) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Category not found
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block">
        <CategoryLayout
          title="Form Edit Category"
          breadcrumb={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Categories", path: "/categories" },
            { label: "Edit Category" },
          ]}
          showBack>
          <CategoryForm defaultValues={category} onSubmit={handleSubmit} loading={loading} />
        </CategoryLayout>
      </div>

      <div className="md:hidden">
        <CategoryForm defaultValues={category} onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}