import CategoryDesktop from "../components/CategoryDesktop";
import CategoryLayout from "../components/CategoryLayout";
import CategoryMobile from "../components/CategoryMobile";
import { useCategories } from "../hooks/useCategories";

export default function CategoryPage() {
  const { categories, loading, refetch } = useCategories();

  return (
    <>
      <div className="hidden md:block">
        <CategoryLayout
          title="List of Category"
          breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Categories" }]}
          button={{ label: "Create Category", url: "/category/create" }}>
          <CategoryDesktop
            loading={loading}
            categories={categories}
            refetch={refetch} />
        </CategoryLayout>
      </div>

      <div className="md:hidden">
        <CategoryMobile
          loading={loading}
          categories={categories}
          refetch={refetch} />
      </div>
    </>
  );
}