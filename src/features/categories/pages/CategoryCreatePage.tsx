import { useNavigate } from "react-router-dom";
import CategoryForm from "../components/CategoryForm";
import CategoryLayout from "../components/CategoryLayout";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { toast } from "sonner";
import type { FormData } from "../utils/category.form.helper";

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const { createCategory, loading } = useCategoryActions();

  async function handleSubmit(data: FormData) {
    try {
      const result = await createCategory(data);
      navigate("/categories")
      toast.success("Success", {
        description: result.message
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

  return (
    <>
      <div className="hidden md:block">
        <CategoryLayout
          title="Form Create Category"
          breadcrumb={[
            { label: "Dashboard", path: "/" },
            { label: "Categories", path: "/categories" },
            { label: "Create Category" },
          ]}
          showBack>
          <CategoryForm onSubmit={handleSubmit} loading={loading} />
        </CategoryLayout>
      </div>

      <div className="md:hidden">
        <CategoryForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}