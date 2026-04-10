import { useNavigate } from "react-router-dom";
import CategoryForm from "../components/CategoryForm";
import CategoryLayout from "../components/CategoryLayout";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { toast } from "sonner";

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const { saveCategory, loading } = useCategoryActions();

  async function handleSubmit(data: { id?: string; name: string }) {
    try {
      const result = await saveCategory(data);
      navigate("/categories")
      toast.success("Success", {
        description: result.message
      });
    } catch (error: any) {
      toast.error("Failed to save category", {
        description: error.message,
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
          showBack
        >
          <CategoryForm onSubmit={handleSubmit} loading={loading} />
        </CategoryLayout>
      </div>

      <div className="md:hidden">
        <CategoryForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}