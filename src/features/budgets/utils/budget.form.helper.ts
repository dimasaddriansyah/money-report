import type { Timestamp } from "firebase/firestore";

export type BudgetCreateData = {
  date: string;
  accountId: string | null;
  remark: string;
  amount: number;
};

export type BudgetUpdateData = {
  id: string;
  date: Timestamp;
  accountId: string | null;
  remark: string;
  amount: number;
};