import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../shared/config/firebase";

export async function migrateTransactions(uid: string) {
  console.log("1. Read transactions");

  const snapshot = await getDocs(collection(db, "transactions"));

  console.log("2. Total transactions:", snapshot.size);

  for (const transaction of snapshot.docs) {
    console.log("Migrating", transaction.id);

    await setDoc(
      doc(
        db,
        "users",
        uid,
        "transactions",
        transaction.id
      ),
      transaction.data()
    );
  }

  console.log("Done");
}