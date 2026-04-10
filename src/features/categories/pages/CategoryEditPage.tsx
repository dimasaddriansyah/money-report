import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "../components/CategoryForm";
import CategoryLayout from "../components/CategoryLayout";
import { useCategories } from "../hooks/useCategories";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { toast } from "sonner";

export default function CategoryEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories, loading: isFetchingCategories } = useCategories();
  const { saveCategory, loading } = useCategoryActions();
  const category = categories.find((acc) => acc.id === id);

  async function handleSubmit(data: { id?: string; name: string }) {
    try {
      const result = await saveCategory(data);
      navigate("/categories")
      toast.success("Success", {
        description: result.message,
      });
    } catch (error: any) {
      toast.error("Failed to update category", {
        description: error.message,
        duration: 2000,
      });
    }
  }

  if (isFetchingCategories) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading categories...
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
            { label: "Dashboard", path: "/" },
            { label: "Categories", path: "/categories" },
            { label: "Edit Category" },
          ]}
          showBack
        >
          <CategoryForm defaultValues={category} onSubmit={handleSubmit} loading={loading} />
        </CategoryLayout>
      </div>

      <div className="md:hidden">
        <CategoryForm defaultValues={category} onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}