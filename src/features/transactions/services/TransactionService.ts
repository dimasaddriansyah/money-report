import { deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import type { Transaction } from "../types/transaction";
import { userCollection } from "../../../shared/utils/firestore.helper";

const transactionCollection = () => userCollection("transactions");
const transactionDoc = (id: string) => doc(transactionCollection(), id);

export async function getTransactions(): Promise<Transaction[]> {
  const snapshot = await getDocs(transactionCollection());

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Transaction[];
}

export async function createTransaction(transaction: Transaction): Promise<void> {
  const { id, ...data } = transaction;
  await setDoc(transactionDoc(id), data);
}

export async function updateTransaction(transaction: Transaction): Promise<void> {
  const { id, ...data } = transaction;
  await setDoc(transactionDoc(id), data);
}

export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(transactionDoc(id));
}