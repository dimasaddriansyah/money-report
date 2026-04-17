import type { Category } from "../types/category";

export async function fetchCategories(): Promise<{ data: Category[] }> {
  const response = await fetch(import.meta.env.VITE_API_URL, {
    method: "POST",
    body: JSON.stringify({
      module: "categories",
      action: "list"
    }),
  });

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(result.message || "Failed to fetch categories");
  }

  return {
    data: result.data,
  };
}