export const TRANSACTION_ACCOUNT_CONFIG = {
  income: {
    fields: ["toAccountId"],
    label: ["Account"],
  },
  expense: {
    fields: ["fromAccountId"],
    label: ["Account"],
  },
  transfer: {
    fields: ["fromAccountId", "toAccountId"],
    label: ["From Account", "To Account"],
  },
} as const;