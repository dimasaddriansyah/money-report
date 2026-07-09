import {
  Timestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export async function migrateCategories(categories: Category[]) {
  try {
    for (const category of categories) {
      await setDoc(doc(db, "categories", category.id), {
        name: category.name,
        createdAt: Timestamp.fromDate(new Date(category.createdAt)),
        updatedAt: category.updatedAt
          ? Timestamp.fromDate(new Date(category.updatedAt))
          : null,
      });

      console.log(`✅ ${category.id} - ${category.name}`);
    }

    console.log("🎉 Category migration completed.");
  } catch (error) {
    console.error("❌ Category migration failed:", error);
  }
}