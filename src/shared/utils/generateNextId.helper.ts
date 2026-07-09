import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Generate next ID based on the highest existing number.
 *
 * Example:
 * generateNextId("accounts", "ACC") => ACC015
 * generateNextId("categories", "CAT") => CAT021
 */

export async function generateNextId(
  collectionName: string,
  prefix: string,
  padding: number = 3
): Promise<string> {
  const snapshot = await getDocs(collection(db, collectionName));

  let maxNumber = 0;

  snapshot.forEach((doc) => {
    const regex = new RegExp(`^${prefix}(\\d+)$`);
    const match = doc.id.match(regex);
    if (!match) return;
    const number = Number(match[1]);
    if (number > maxNumber) {
      maxNumber = number;
    }
  });

  const nextNumber = maxNumber + 1;
  return `${prefix}${String(nextNumber).padStart(padding, "0")}`;
}