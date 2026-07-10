import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import type { Budget } from "../types/budget";

const COLLECTION_NAME = "budgets";

export async function getBudgets(): Promise<Budget[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Budget[];
}

async function saveBudget(budget: Budget): Promise<void> {
  const { id, ...data } = budget;

  await setDoc(doc(db, COLLECTION_NAME, id), data);
}

export async function createBudget(budget: Budget): Promise<void> {
  await saveBudget(budget);
}

export async function updateBudget(budget: Budget): Promise<void> {
  await saveBudget(budget);
}

export async function deleteBudget(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}