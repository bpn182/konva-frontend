import { db } from "./config";
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";

const saveShapes = async (userId: string, drawingName: string, shapes: any) => {
  try {
    const shapesDoc = doc(db, "users", userId, "drawings", drawingName);
    await setDoc(shapesDoc, { shapes });
    console.log("Shapes saved successfully!");
  } catch (error) {
    console.error("Error saving shapes: ", error);
  }
};

const loadShapes = async (userId: string, drawingName: string) => {
  try {
    const shapesDoc = doc(db, "users", userId, "drawings", drawingName);
    const shapesSnapshot = await getDoc(shapesDoc);
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

const listDrawings = async (userId: string) => {
  try {
    const drawingsCollection = collection(db, "users", userId, "drawings");
    const drawingsSnapshot = await getDocs(drawingsCollection);
    return drawingsSnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error("Error listing drawings: ", error);
    return [];
  }
};

export { saveShapes, loadShapes, listDrawings };