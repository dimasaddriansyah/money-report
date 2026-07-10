import { collection, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";
import { db } from "../../../firebase";
import type { Transaction } from "../types/transaction";

const COLLECTION_NAME = "transactions";

// GET TRANSACTIONS
export async function getTransactions(): Promise<Transaction[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Transaction[];
}

// CREATE TRANSACTION
export async function createTransaction(
  transaction: Transaction
): Promise<void> {
  const { id, ...data } = transaction;
  await setDoc(doc(db, COLLECTION_NAME, id), data);
}

// UPDATE TRANSACTION
export async function updateTransaction(
  transaction: Transaction
): Promise<void> {
  const { id, ...data } = transaction;
  await setDoc(doc(db, COLLECTION_NAME, id), data);
}

// DELETE TRANSACTION
export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}