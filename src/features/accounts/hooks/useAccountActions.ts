import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import {
  createAccount as createAccountService,
  updateAccount as updateAccountService,
  deleteAccount as deleteAccountService,
} from "../services/AccountService";
import { generateId } from "../../../shared/utils/generateId.helper";
import type { FormData } from "../utils/account.form.helper";

export function useAccountActions(refetch?: () => Promise<void>) {
  const [loading, setLoading] = useState(false);

  async function createAccount(data: FormData) {
    try {
      setLoading(true);

      const id = await generateId({
        collection: "accounts",
        prefix: "ACC",
      });

      await createAccountService({
        id,
        name: data.name,
        createdAt: Timestamp.now(),
        updatedAt: null,
      });

      await refetch?.();

      return {
        message: "Account created successfully",
      };
    } catch (error) {
      console.error("Create account failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateAccount(data: FormData) {
    try {
      setLoading(true);

      if (!data.id) {
        throw new Error("Account ID is required");
      }

      await updateAccountService({
        id: data.id,
        name: data.name,
      });

      await refetch?.();

      return {
        message: "Account updated successfully",
      };
    } catch (error) {
      console.error("Update account failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteAccount(id: string) {
    try {
      setLoading(true);

      await deleteAccountService(id);

      await refetch?.();

      return {
        message: "Account deleted successfully",
      };
    } catch (error) {
      console.error("Delete account failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    createAccount,
    updateAccount,
    deleteAccount,
    loading,
  };
}