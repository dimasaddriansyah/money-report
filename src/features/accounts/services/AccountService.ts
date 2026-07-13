import { collection, deleteDoc, doc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import type { Account } from "../types/account";
import { db } from "../../../shared/config/firebase";

const COLLECTION_NAME = "accounts";

export async function getAccounts(): Promise<Account[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Account[];
}

export async function createAccount(account: Account): Promise<void> {
  const { id, ...data } = account;
  await setDoc(doc(db, COLLECTION_NAME, id), data);
}

export async function updateAccount(data: { id: string; name: string }) {
  await updateDoc(doc(db, COLLECTION_NAME, data.id), {
    name: data.name,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteAccount(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}