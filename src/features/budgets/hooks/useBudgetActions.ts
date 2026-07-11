import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import {
  createBudget as createBudgetService,
  updateBudget as updateBudgetService,
  deleteBudget as deleteBudgetService,
} from "../services/BudgetService";
import { generateId } from "../../../shared/utils/generateId.helper";
import type { FormData } from "../utils/budget.form.helper";

function buildBudgetTimestamp(date: string): Timestamp {
  const now = new Date();

  return Timestamp.fromDate(
    new Date(`${date}T${now.toTimeString().slice(0, 8)}`)
  );
}

export function useBudgetActions(refetch?: () => Promise<void>) {
  const [loading, setLoading] = useState(false);

  async function createBudget(data: FormData) {
    try {
      setLoading(true);

      const id = await generateId({
        collection: "budgets",
        prefix: "BUD",
      });

      await createBudgetService({
        id,
        date: buildBudgetTimestamp(data.date),
        accountId: data.accountId,
        remark: data.remark,
        amount: data.amount,
      });

      await refetch?.();

      return {
        message: "Budget created successfully",
      };
    } catch (error) {
      console.error("Create budget failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateBudget(data: FormData) {
    try {
      setLoading(true);

      if (!data.id) {
        throw new Error("Budget ID is required");
      }

      await updateBudgetService({
        id: data.id,
        date: buildBudgetTimestamp(data.date),
        accountId: data.accountId,
        remark: data.remark,
        amount: data.amount,
      });

      await refetch?.();

      return {
        message: "Budget updated successfully",
      };
    } catch (error) {
      console.error("Update budget failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteBudget(id: string) {
    try {
      setLoading(true);

      await deleteBudgetService(id);

      await refetch?.();

      return {
        message: "Budget deleted successfully",
      };
    } catch (error) {
      console.error("Delete budget failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    createBudget,
    updateBudget,
    deleteBudget,
    loading,
  };
}