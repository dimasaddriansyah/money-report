import { useState } from "react";
import {
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from "../services/CategoryService";
import { generateId } from "../../../shared/utils/generateId.helper";
import type { FormData } from "../utils/category.form.helper";

export function useCategoryActions(refetch?: () => Promise<void>) {
  const [loading, setLoading] = useState(false);

  async function createCategory(data: FormData) {
    try {
      setLoading(true);

      const id = await generateId({
        collection: "categories",
        prefix: "CAT"
      });

      await createCategoryService({
        id,
        name: data.name,
      });

      await refetch?.();

      return {
        message: "Category created successfully",
      };
    } catch (error) {
      console.error("Create category failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateCategory(data: FormData) {
    try {
      setLoading(true);

      if (!data.id) {
        throw new Error("Category ID is required");
      }

      await updateCategoryService({
        id: data.id,
        name: data.name,
      });

      await refetch?.();

      return {
        message: "Category updated successfully",
      };
    } catch (error) {
      console.error("Update category failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    try {
      setLoading(true);

      await deleteCategoryService(id);

      await refetch?.();

      return {
        message: "Category deleted successfully",
      }
    } catch (error) {
      console.error("Delete category failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
  };
}