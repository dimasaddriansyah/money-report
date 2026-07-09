import {
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface Budget {
  id: string;
  date: string;
  accountId: string;
  remark: string;
  amount: number;
}

export async function migrateBudgets(budgets: Budget[]) {
  try {
    for (const budget of budgets) {
      await setDoc(doc(db, "budgets", budget.id), {
        date: Timestamp.fromDate(new Date(budget.date)),
        accountId: budget.accountId,
        remark: budget.remark,
        amount: budget.amount,
      });

      console.log(`✅ ${budget.id} - ${budget.remark}`);
    }

    console.log("🎉 Budget migration completed.");
  } catch (error) {
    console.error("❌ Budget migration failed:", error);
  }
}