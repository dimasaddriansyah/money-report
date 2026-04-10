import type { Category } from "../types/category";

export default function CategoryMobile({ categories }: { categories: Category[]; }) {
  return (
    <div className="space-y-2">
      {categories.map((row, index) => (
        <div
          key={`${row.id}-${index}`}
          className="p-4 bg-white rounded-xl border"
        >
          <p className="text-sm text-slate-500">Category</p>
          <p className="font-medium text-slate-900">
            {row.name}
          </p>
        </div>
      ))}
    </div>
  );
}