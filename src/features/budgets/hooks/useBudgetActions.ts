import { useState } from "react";
import { API_URL } from "../../../shared/config/api.config";

export function useBudgetActions(refetch?: () => void) {
  const [loading, setLoading] = useState(false);

  async function saveBudget(data: {
    id?: string;
    date: string;
    accountId?: string;
    remark: string;
    amount: number;
  }) {
    const isEdit = !!data.id;

    const payload = {
      module: "budgets",
      action: isEdit ? "edit" : "create",
      id: data.id,
      date: data.date,
      accountId: data.accountId,
      remark: data.remark,
      amount: data.amount,
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
      
      refetch?.();

      return result;
    } catch (error) {
      console.error("Submit error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteBudget(id: string) {
    try {
      setLoading(true);

      const payload = {
        module: "budgets",
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
    saveBudget,
    deleteBudget,
    loading,
  };
}