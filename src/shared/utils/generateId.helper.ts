import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

interface GenerateIdOptions {
  collection: string;
  prefix: string;
  padding?: number;
  date?: string;
}

/**
 * Generate next document ID.
 *
 * Examples:
 *
 * Accounts
 * generateId({
 *   collection: "accounts",
 *   prefix: "ACC"
 * }) => ACC001
 *
 * Transactions
 * generateId({
 *   collection: "transactions",
 *   prefix: "TRX",
 *   date: "2026-05-25"
 * }) => TRX20260525001
 */

export async function generateId({
  collection: collectionName,
  prefix,
  padding = 3,
  date,
}: GenerateIdOptions): Promise<string> {
  const snapshot = await getDocs(collection(db, collectionName));

  let maxNumber = 0;

  if (date) {
    const dateKey = date.replaceAll("-", "");

    snapshot.forEach((doc) => {
      const regex = new RegExp(`^${prefix}${dateKey}(\\d{${padding}})$`);

      const match = doc.id.match(regex);

      if (!match) return;

      const number = Number(match[1]);

      if (number > maxNumber) {
        maxNumber = number;
      }
    });

    return `${prefix}${dateKey}${String(maxNumber + 1).padStart(padding, "0")}`;
  }

  snapshot.forEach((doc) => {
    const regex = new RegExp(`^${prefix}(\\d+)$`);

    const match = doc.id.match(regex);

    if (!match) return;

    const number = Number(match[1]);

    if (number > maxNumber) {
      maxNumber = number;
    }
  });

  return `${prefix}${String(maxNumber + 1).padStart(padding, "0")}`;
}