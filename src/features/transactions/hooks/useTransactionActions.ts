import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import {
  createTransaction as createTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
} from "../services/TransactionService";
import { generateId } from "../../../shared/utils/generateId.helper";
import type { FormData } from "../utils/transaction.form.helper";

export function useTransactionActions(refetch?: () => Promise<void>) {
  const [loading, setLoading] = useState(false);

  async function createTransaction(data: FormData) {
    try {
      setLoading(true);

      const id = await generateId({
        collection: "transactions",
        prefix: "TRX",
        date: data.date,
      });

      const now = new Date();
      const transactionDate = new Date(`${data.date}T${now.toTimeString().slice(0, 8)}`);

      await createTransactionService({
        id,
        date: Timestamp.fromDate(transactionDate),
        typeId: data.typeId,
        categoryId:
          data.typeId === "TP003"
            ? "CAT022"
            : (data.categoryId ?? null),
        fromAccountId: data.fromAccountId ?? null,
        toAccountId: data.toAccountId ?? null,
        remark: data.remark,
        amount: data.amount,
      });

      await refetch?.();

      return {
        message: "Transaction created successfully",
      };
    } catch (error) {
      console.error("Create transaction failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateTransaction(data: FormData) {
    try {
      setLoading(true);

      if (!data.id) {
        throw new Error("Transaction ID is required");
      }

      const now = new Date();
      const transactionDate = new Date(`${data.date}T${now.toTimeString().slice(0, 8)}`);

      await updateTransactionService({
        id: data.id,
        date: Timestamp.fromDate(transactionDate),
        typeId: data.typeId,
        categoryId:
          data.typeId === "TP003"
            ? "CAT022"
            : (data.categoryId ?? null),
        fromAccountId: data.fromAccountId ?? null,
        toAccountId: data.toAccountId ?? null,
        remark: data.remark,
        amount: data.amount,
      });

      await refetch?.();

      return {
        message: "Transaction updated successfully",
      };
    } catch (error) {
      console.error("Update transaction failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteTransaction(id: string) {
    try {
      setLoading(true);

      await deleteTransactionService(id);

      await refetch?.();

      return {
        message: "Transaction deleted successfully",
      };
    } catch (error) {
      console.error("Delete transaction failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
  };
}