export interface Transaction {
  id: string;
  day: string;
  date: string;
  typeId: string;
  categoryId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  remark: string;
  amount: number;
}
