import { Timestamp } from "firebase/firestore";

export interface Account {
  id: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
}