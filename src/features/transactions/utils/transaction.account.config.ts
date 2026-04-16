export const TRANSACTION_ACCOUNT_CONFIG = {
  "TP001": {
    fields: ["toAccountId"],
    label: ["Account"],
  },
  "TP002": {
    fields: ["fromAccountId"],
    label: ["Account"],
  },
  "TP003": {
    fields: ["fromAccountId", "toAccountId"],
    label: ["From Account", "To Account"],
  },
} as const;