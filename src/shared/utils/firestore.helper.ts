import { collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export function userCollection(name: string) {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("User not authenticated");
  }

  return collection(db, "users", uid, name);
}