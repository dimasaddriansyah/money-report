import { useState } from "react";
import { Note05Icon } from "hugeicons-react";
import type { Category } from "../types/category";
import type { FormData } from "../utils/category.form.helper";
import TextField from "../../../shared/ui/TextField";

type Props = {
  defaultValues?: Category;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
};

export default function CategoryForm({ defaultValues, onSubmit, loading }: Props) {
  const isEdit = !!defaultValues;
  const [name, setName] = useState(defaultValues?.name || "");

  const [errors, setErrors] = useState({
    name: ""
  });

  function validate() {
    const newErrors = {
      name: ""
    }

    if (!name.trim()) {
      newErrors.name = "Category name is required"
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      id: defaultValues?.id,
      name,
    });
  }

  function handleReset() {
    setName(defaultValues?.name || "");
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-0">
      <TextField
        label="Category Name"
        type="text"
        leftIcon={<Note05Icon size={20} className={errors.name ? "text-red-400" : "text-slate-400"} />}
        value={name}
        placeholder="Input category name"
        error={errors.name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors((prev) => ({
            ...prev,
            name: "",
          }));
        }} />
      <div className="flex flex-col md:flex-row-reverse mt-4 gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="order-2 px-5 py-3 text-sm text-slate-400 rounded-xl cursor-pointer">Reset</button>
        <button
          type="submit"
          disabled={loading}
          className={`order-1 px-5 py-3 text-sm font-semibold text-white rounded-xl cursor-pointer
            ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-black hover:bg-black/80"}`}>
          {loading ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  )
}

