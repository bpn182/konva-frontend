import { db } from "./config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const getUserByUsername = async (username: string) => {
  const userDoc = doc(db, "users", username);
  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    return { id: userSnapshot.id, username: userSnapshot.data().username };
  }
  return null;
};

const createUser = async (username: string) => {
  const userDoc = doc(db, "users", username);
  await setDoc(userDoc, { username });
  return { id: userDoc.id, username };
};

export { getUserByUsername, createUser };