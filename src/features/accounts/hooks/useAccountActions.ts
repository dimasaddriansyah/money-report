import { useState } from "react";
import { API_URL } from "../../../shared/config/api.config";

export function useAccountActions(refetch?: () => void) {
  const [loading, setLoading] = useState(false);

  async function saveAccount(data: { id?: string; name: string }) {
    const isEdit = !!data.id;

    const payload = {
      module: "accounts",
      action: isEdit ? "edit" : "create",
      id: data.id,
      name: data.name,
      date: new Date().toISOString(),
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

  async function deleteAccount(id: string) {
  try {
    setLoading(true);

    const payload = {
      module: "accounts",
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
    saveAccount,
    deleteAccount,
    loading,
  };
}