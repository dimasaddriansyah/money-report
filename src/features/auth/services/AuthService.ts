import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../shared/config/firebase";

export async function login(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logout() {
  await signOut(auth);
}
