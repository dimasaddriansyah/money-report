// budget.ts
import type { Timestamp } from "firebase/firestore";

export interface Budget {
  id: string;
  date: Timestamp;
  accountId: string | null;
  remark: string;
  amount: number;
}