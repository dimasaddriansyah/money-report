export type TransactionType = "income" | "expenses" | "transfer";

export interface Transactions {
  transaction_id: string;
  day: string;
  date: string;
  type: TransactionType;
  category: string;
  remark: string;
  from_account: string;
  to_account: string;
  nominal: number;
}
