import { db } from "./config";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Retrieves a user by their username from Firestore.
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<{ id: string, username: string } | null>} - The user data if found, otherwise null.
 */
const getUserByUsername = async (username: string) => {
  // Reference to the user document in Firestore
  const userDoc = doc(db, "users", username);
  // Fetch the user document from Firestore
  const userSnapshot = await getDoc(userDoc);
  // Check if the user document exists
  if (userSnapshot.exists()) {
    // Return the user ID and username if the document exists
    return { id: userSnapshot.id, username: userSnapshot.data().username };
  }
  // Return null if the user document does not exist
  return null;
};

/**
 * Creates a new user with the given username in Firestore.
 * @param {string} username - The username of the new user.
 * @returns {Promise<{ id: string, username: string }>} - The created user data.
 */
const createUser = async (username: string) => {
  // Reference to the user document in Firestore
  const userDoc = doc(db, "users", username);
  // Set the user document in Firestore with the username
  await setDoc(userDoc, { username });
  // Return the user ID and username
  return { id: userDoc.id, username };
};

export { getUserByUsername, createUser };