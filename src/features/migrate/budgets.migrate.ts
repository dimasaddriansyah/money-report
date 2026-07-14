import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../shared/config/firebase";

export async function migrateBudgets(uid: string) {
  console.log("1. Read budgets");

  const snapshot = await getDocs(collection(db, "budgets"));

  console.log("2. Total budgets:", snapshot.size);

  for (const budget of snapshot.docs) {
    console.log("Migrating", budget.id);

    await setDoc(
      doc(
        db,
        "users",
        uid,
        "budgets",
        budget.id
      ),
      budget.data()
    );
  }

  console.log("Done");
}