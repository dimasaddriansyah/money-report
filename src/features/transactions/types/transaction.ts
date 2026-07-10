import { Timestamp } from "firebase/firestore";

export interface Transaction {
  id: string;
  date: Timestamp;
  typeId: string;
  categoryId: string | null; 
  fromAccountId: string | null;
  toAccountId: string | null;
  remark: string;
  amount: number;
}