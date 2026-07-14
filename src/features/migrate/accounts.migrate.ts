import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../shared/config/firebase";

export async function migrateAccounts(uid: string) {
  console.log("1. Read accounts");

  const snapshot = await getDocs(collection(db, "accounts"));

  console.log("2. Total accounts:", snapshot.size);

  for (const account of snapshot.docs) {
    console.log("Migrating", account.id);

    await setDoc(
      doc(
        db,
        "users",
        uid,
        "accounts",
        account.id
      ),
      account.data()
    );
  }

  console.log("Done");
}