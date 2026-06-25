import CategoryDesktop from "../components/CategoryDesktop";
import CategoryLayout from "../components/CategoryLayout";
import CategoryMobile from "../components/CategoryMobile";
import { useCategories } from "../hooks/useCategories";

export default function CategoryPage() {
  const { categories, loading, refetch } = useCategories();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-slate-200 border-t-slate-900 animate-spin" />
        <span className="text-sm text-slate-400">Loading categories...</span>
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
          <CategoryDesktop categories={categories} refetch={refetch} />
        </CategoryLayout>
      </div>

      <div className="md:hidden">
        <CategoryMobile categories={categories} refetch={refetch} />
      </div>
    </>
  );
}