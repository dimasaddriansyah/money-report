import { deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import type { Budget } from "../types/budget";
import { userCollection } from "../../../shared/utils/firestore.helper";

const budgetCollection = () => userCollection("budgets");
const budgetDoc = (id: string) => doc(budgetCollection(), id);

export async function getBudgets(): Promise<Budget[]> {
  const snapshot = await getDocs(budgetCollection());

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Budget[];
}

async function saveBudget(budget: Budget): Promise<void> {
  const { id, ...data } = budget;
  await setDoc(budgetDoc(id), data);
}

export async function createBudget(budget: Budget): Promise<void> {
  await saveBudget(budget);
}

export async function updateBudget(budget: Budget): Promise<void> {
  await saveBudget(budget);
}

export async function deleteBudget(id: string): Promise<void> {
  await deleteDoc(budgetDoc(id));
}