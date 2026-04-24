import { useState } from "react";
import { API_URL } from "../../../shared/config/api.config";
import { formatDateInput } from "../../../shared/utils/format.helper";

export function useCategoryActions(refetch?: () => void) {
  const [loading, setLoading] = useState(false);

  async function saveCategory(data: {
    id?: string;
    name: string;
    createdAt?: string;
  }) {
    const isEdit = !!data.id;

    const payload = {
      module: "categories",
      action: isEdit ? "edit" : "create",
      id: data.id,
      name: data.name,
      createdAt: isEdit ? formatDateInput(data.createdAt) : formatDateInput(),
      updatedAt: isEdit ? formatDateInput() : undefined,
    };

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status !== "success") {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
      console.error("Submit error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    try {
      setLoading(true);

      const payload = {
        module: "categories",
        action: "delete",
        id,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status !== "success") {
        throw new Error(result.message);
      }

      refetch?.();

      return result;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    saveCategory,
    deleteCategory,
    loading,
  };
}