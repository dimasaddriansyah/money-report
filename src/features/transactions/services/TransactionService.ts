import type { Transaction } from "../types/transaction";

export async function fetchTransactions(
  page : number,
  limit : number
): Promise<{
  data: Transaction[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
  }
}> {
  const response = await fetch(import.meta.env.VITE_API_URL, {
    method: "POST",
    body: JSON.stringify({
      module: "transactions",
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