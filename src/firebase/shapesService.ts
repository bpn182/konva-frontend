import { db } from "./config";
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";

/**
 * Saves shapes to Firestore under a specific user's drawing.
 * @param {string} userId - The ID of the user.
 * @param {string} drawingName - The name of the drawing.
 * @param {any} shapes - The shapes data to save.
 * @returns {Promise<void>}
 */
const saveShapes = async (
  userId: string,
  drawingName: string,
  shapes: any
): Promise<void> => {
  try {
    // Reference to the specific drawing document in Firestore
    const shapesDoc = doc(db, "users", userId, "drawings", drawingName);
    // Save the shapes data to the document
    await setDoc(shapesDoc, { shapes });
    console.log("Shapes saved successfully!");
  } catch (error) {
    console.error("Error saving shapes: ", error);
  }
};

/**
 * Loads shapes from Firestore for a specific user's drawing.
 * @param {string} userId - The ID of the user.
 * @param {string} drawingName - The name of the drawing.
 * @returns {Promise<any[]>} - The loaded shapes data.
 */
const loadShapes = async (
  userId: string,
  drawingName: string
): Promise<any[]> => {
  try {
    // Reference to the specific drawing document in Firestore
    const shapesDoc = doc(db, "users", userId, "drawings", drawingName);
    // Fetch the document from Firestore
    const shapesSnapshot = await getDoc(shapesDoc);
    // Check if the document exists and return the shapes data
    if (shapesSnapshot.exists()) {
      return shapesSnapshot.data().shapes;
    } else {
      console.log("No shapes found!");
      return [];
    }
  } catch (error) {
    console.error("Error loading shapes: ", error);
    return [];
  }
};

/**
 * Lists all drawings for a specific user from Firestore.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string[]>} - A list of drawing names.
 */
const listDrawings = async (userId: string): Promise<string[]> => {
  try {
    // Reference to the drawings collection for the user in Firestore
    const drawingsCollection = collection(db, "users", userId, "drawings");
    // Fetch all documents in the collection
    const drawingsSnapshot = await getDocs(drawingsCollection);
    // Map the document IDs to an array of drawing names
    return drawingsSnapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error("Error listing drawings: ", error);
    return [];
  }
};

export { saveShapes, loadShapes, listDrawings };
