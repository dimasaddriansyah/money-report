import type { Account } from "../types/account";

export async function fetchAccounts(
  page: number = 1,
  limit: number = 10
): Promise<{
  data: Account[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
  }
}> {
  const response = await fetch(import.meta.env.VITE_API_URL, {
    method: "POST",
    body: JSON.stringify({
      module: "accounts",
      action: "list",
      page,
      limit,
    }),
  });

  const result = await response.json();

  return {
    data: result.data,
    meta: result.meta
  };
}