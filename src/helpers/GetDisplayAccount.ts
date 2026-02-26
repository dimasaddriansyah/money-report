import type { Transaction } from "../types/Transactions";

export const getDisplayAccount = (
  trx: Transaction,
  currentAccount?: string,
) => {
  // 🔥 DASHBOARD MODE (tidak dalam halaman account tertentu)
  if (!currentAccount) {
    if (trx.type === "income") return trx.to_account;
    if (trx.type === "expenses") return trx.from_account;

    if (trx.type === "transfer") {
      return `${trx.from_account} → ${trx.to_account}`;
    }
  }

  // 🔥 ACCOUNT PAGE MODE
  if (trx.type === "transfer" && currentAccount) {
    if (trx.from_account === currentAccount) return `${trx.to_account}`;
    if (trx.to_account === currentAccount) return `${trx.from_account}`;
  }

  return currentAccount;
};
