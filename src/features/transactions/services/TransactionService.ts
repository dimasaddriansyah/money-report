import { API_URL } from "../../../shared/config/api.config";
import type { Transaction } from "../types/transaction";

export async function fetchTransactions(): Promise<{ data: Transaction[] }> {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      module: "transactions",
      action: "list"
    }),
  });

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(result.message || "Failed to fetch transactions");
  }

  return {
    data: result.data,
  };
}