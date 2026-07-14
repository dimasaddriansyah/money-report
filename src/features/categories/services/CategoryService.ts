import { deleteDoc, doc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { userCollection } from "../../../shared/utils/firestore.helper";
import type { Category } from "../types/category";

const categoryCollection = () => userCollection("categories");
const categoryDoc = (id: string) => doc(categoryCollection(), id);

export async function getCategories(): Promise<Category[]> {
  const snapshot = await getDocs(categoryCollection());

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}

export async function createCategory(category: Category): Promise<void> {
  const { id, ...data } = category;
  await setDoc(categoryDoc(id), data);
}

export async function updateCategory(data: {
  id: string;
  name: string;
}) {
  const { id, ...payload } = data;

  await updateDoc(categoryDoc(id), {
    ...payload,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(categoryDoc(id));
}