import { deleteDoc, doc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { userCollection } from "../../../shared/utils/firestore.helper";
import type { Account } from "../types/account";

const accountCollection = () => userCollection("accounts");
const accountDoc = (id: string) => doc(accountCollection(), id);

export async function getAccounts(): Promise<Account[]> {
  const snapshot = await getDocs(accountCollection());

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Account[];
}

export async function createAccount(account: Account): Promise<void> {
  const { id, ...data } = account;
  await setDoc(accountDoc(id), data);
}

export async function updateAccount(data: {
  id: string;
  name: string;
}) {
  const { id, ...payload } = data;

  await updateDoc(accountDoc(id), {
    ...payload,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteAccount(id: string): Promise<void> {
  await deleteDoc(accountDoc(id));
}