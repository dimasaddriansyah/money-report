import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import type { Category } from "../types/category";

const COLLECTION_NAME = "categories";

// GET CATEGORY
export async function getCategories(): Promise<Category[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}

// CREATE CATEGORY
export async function createCategory(
  category: Pick<Category, "id" | "name">
): Promise<void> {
  await setDoc(doc(db, COLLECTION_NAME, category.id), {
    name: category.name,
    createdAt: serverTimestamp(),
    updatedAt: null,
  });
}

// UPDATE CATEGORY
export async function updateCategory(
  category: Pick<Category, "id" | "name">
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, category.id), {
    name: category.name,
    updatedAt: serverTimestamp(),
  });
}

// DELETE CATEGORY
export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}