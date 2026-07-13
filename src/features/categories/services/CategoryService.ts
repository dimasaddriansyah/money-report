import { collection, deleteDoc, doc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../shared/config/firebase";
import type { Category } from "../types/category";

const COLLECTION_NAME = "categories";

export async function getCategories(): Promise<Category[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}

export async function createCategory(account: Category): Promise<void> {
  const { id, ...data } = account;
  await setDoc(doc(db, COLLECTION_NAME, id), data);
}

export async function updateCategory(data: { id: string; name: string }) {
  await updateDoc(doc(db, COLLECTION_NAME, data.id), {
    name: data.name,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}