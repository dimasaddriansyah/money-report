import { API_URL } from "../../../shared/config/api.config";
import type { Account } from "../types/account";

export async function fetchAccounts(): Promise<{ data: Account[] }> {
  const response = await fetch(API_URL, {
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