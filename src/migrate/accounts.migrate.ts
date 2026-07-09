import {
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface Account {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export async function migrateAccounts(accounts: Account[]) {
  try {
    for (const account of accounts) {
      await setDoc(doc(db, "accounts", account.id), {
        name: account.name,
        createdAt: Timestamp.fromDate(new Date(account.createdAt)),
        updatedAt: account.updatedAt
          ? Timestamp.fromDate(new Date(account.updatedAt))
          : null,
      });

      console.log(`✅ ${account.id} - ${account.name}`);
    }

    console.log("🎉 Account migration completed.");
  } catch (error) {
    console.error("❌ Account migration failed:", error);
  }
}