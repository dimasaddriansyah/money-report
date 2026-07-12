import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import type { Account } from "../types/account";
import { db } from "../../../shared/config/firebase";

const COLLECTION_NAME = "accounts";

// GET ACCOUNTS
export async function getAccounts(): Promise<Account[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Account[];
}

// CREATE ACCOUNT
export async function createAccount(
  account: Account
): Promise<void> {
  await setDoc(doc(db, COLLECTION_NAME, account.id), {
    name: account.name,
    createdAt: serverTimestamp(),
    updatedAt: null,
  });
}

// UPDATE ACCOUNT
export async function updateAccount(
  account: Account
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, account.id), {
    name: account.name,
    updatedAt: serverTimestamp(),
  });
}

// DELETE ACCOUNT
export async function deleteAccount(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}