import {
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../shared/config/firebase";

interface Transaction {
  id: string;
  date: string;
  typeId: string;
  categoryId: string;
  fromAccountId: string;
  toAccountId: string;
  remark: string;
  amount: number;
}

export async function migrateTransactions(transactions: Transaction[]) {
  try {
    for (const transaction of transactions) {
      await setDoc(doc(db, "transactions", transaction.id), {
        date: Timestamp.fromDate(new Date(transaction.date)),
        typeId: transaction.typeId,
        categoryId: transaction.categoryId,
        fromAccountId: transaction.fromAccountId,
        toAccountId: transaction.toAccountId,
        remark: transaction.remark,
        amount: transaction.amount,
      });

      console.log(`✅ ${transaction.id} - ${transaction.remark}`);
    }

    console.log("🎉 Transaction migration completed.");
  } catch (error) {
    console.error("❌ Transaction migration failed:", error);
  }
}