import CategoryDesktop from "../components/CategoryDesktop";
import CategoryLayout from "../components/CategoryLayout";
import CategoryMobile from "../components/CategoryMobile";
import { useCategories } from "../hooks/useCategories";

export default function CategoryPage() {
  const { categories, loading, refetch } = useCategories();

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading categories...
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <CategoryLayout
          title="List of Category"
          breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Categories" }]}
          button={{ label: "Create Category", url: "/category/create" }}
        >
          <CategoryDesktop categories={categories} refetch={refetch}/>
        </CategoryLayout>
      </div>

      <div className="md:hidden">
        <CategoryMobile categories={categories} refetch={refetch}/>
      </div>
    </>
  );
}