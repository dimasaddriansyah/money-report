import { API_URL } from "../../../shared/config/api.config";
import type { Budget } from "../types/budget";

export async function fetchBudgets(): Promise<{ data: Budget[] }> {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      module: "budgets",
      action: "list"
    }),
  });

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(result.message || "Failed to fetch budgets");
  }

  return {
    data: result.data,
  };
}