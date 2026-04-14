import { useState } from "react";
import { API_URL } from "../../../services/APIServices";
import { smartCapitalize } from "../../../helpers/Format";
import { formatDateDay } from "../../../shared/utils/format.helper";

export function useTransactionActions(refetch?: () => void) {
  const [loading, setLoading] = useState(false);

  async function saveTransaction(data: {
    id?: string;
    date: string;
    type: string;
    categoryId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    amount: number;
    remark: string;
  }) {
    const isEdit = !!data.id;

    const payload = {
      module: "transactions",
      action: isEdit ? "edit" : "create",
      id: data.id,
      day: formatDateDay(data.date),
      date: data.date,
      type: smartCapitalize(data.type),
      categoryId: data.type === "transfer" ? "" : data.categoryId,
      fromAccountId: data.fromAccountId,
      toAccountId: data.toAccountId,
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
      return result;
    } catch (error) {
      console.error("Submit error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteTransaction(id: string) {
    try {
      setLoading(true);

      const payload = {
        module: "transactions",
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
    saveTransaction,
    deleteTransaction,
    loading,
  };
}
