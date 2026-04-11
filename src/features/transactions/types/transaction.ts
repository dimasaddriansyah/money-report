export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  categoryId?: string;
  remark?: string;
  amount: number;
  fromAccountId?: string;
  toAccountId?: string;
}
