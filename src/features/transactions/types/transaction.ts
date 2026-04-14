export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  categoryId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  remark?: string;
  amount: number;
}
