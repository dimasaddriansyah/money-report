import { getDocs } from "firebase/firestore";
import { userCollection } from "./firestore.helper";

interface GenerateIdOptions {
  collection: string;
  prefix: string;
  padding?: number;
  date?: string;
}

export async function generateId({
  collection,
  prefix,
  padding = 3,
  date,
}: GenerateIdOptions): Promise<string> {

  const snapshot = await getDocs(
    userCollection(collection)
  );

  let maxNumber = 0;

  if (date) {
    const dateKey = date.replaceAll("-", "");

    snapshot.forEach((doc) => {
      const regex = new RegExp(
        `^${prefix}${dateKey}(\\d{${padding}})$`
      );

      const match = doc.id.match(regex);

      if (!match) return;

      const number = Number(match[1]);

      if (number > maxNumber) {
        maxNumber = number;
      }
    });

    return `${prefix}${dateKey}${String(maxNumber + 1).padStart(
      padding,
      "0"
    )}`;
  }

  snapshot.forEach((doc) => {
    const regex = new RegExp(
      `^${prefix}(\\d+)$`
    );

    const match = doc.id.match(regex);

    if (!match) return;

    const number = Number(match[1]);

    if (number > maxNumber) {
      maxNumber = number;
    }
  });

  return `${prefix}${String(maxNumber + 1).padStart(
    padding,
    "0"
  )}`;
}