export interface FormData {
  id?: string;
  date: string;
  typeId: string;
  categoryId: string | null;
  fromAccountId: string | null;
  toAccountId: string | null;
  amount: number;
  remark: string;
}