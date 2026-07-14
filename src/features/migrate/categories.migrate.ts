import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../shared/config/firebase";

export async function migrateCategories(uid: string) {
  console.log("1. Read categories");

  const snapshot = await getDocs(collection(db, "categories"));

  console.log("2. Total categories:", snapshot.size);

  for (const category of snapshot.docs) {
    console.log("Migrating", category.id);

    await setDoc(
      doc(
        db,
        "users",
        uid,
        "categories",
        category.id
      ),
      category.data()
    );
  }

  console.log("Done");
}