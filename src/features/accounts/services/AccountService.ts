import type { Account } from "../types/account";

export async function fetchAccounts(): Promise<{ data: Account[] }> {
  const response = await fetch(import.meta.env.VITE_API_URL, {
    method: "POST",
    body: JSON.stringify({
      module: "accounts",
      action: "list"
    }),
  });

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(result.message || "Failed to fetch accounts");
  }

  return {
    data: result.data,
  };
}