import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth, db } from "../../../shared/config/firebase";
import type { LoginForm, RegisterForm } from "../types/Auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export async function register(data: RegisterForm) {
  const credential =
    await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

  await updateProfile(
    credential.user,
    {
      displayName: data.name,
    }
  );

  await setDoc(
    doc(db, "users", credential.user.uid),
    {
      name: data.name,
      email: data.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return credential.user;
}

export async function login(data: LoginForm) {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

  return credential.user;
}

export async function logout() {
  await signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}
