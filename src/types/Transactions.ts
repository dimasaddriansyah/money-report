export type TransactionType = "income" | "expenses" | "transfer";

export interface Transaction {
  transaction_id: string;
  date: string;
  type: TransactionType;
  payment: string;
  category: string;
  remark: string;
  nominal: number;
}
