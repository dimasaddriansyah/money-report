import type { Transaction } from "../types/transaction";

export async function fetchTransactions(): Promise<{ data: Transaction[] }> {
  const response = await fetch(import.meta.env.VITE_API_URL, {
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