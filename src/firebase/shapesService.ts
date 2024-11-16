import axiosInstance from "./axiosConfig";

/**
 * Saves shapes to Firestore under a specific user's drawing using axios.
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
    await axiosInstance.post("/saveShapes", {
      userId,
      drawingName,
      shapes,
    });

    console.log("Shapes saved successfully!");
  } catch (error) {
    console.error("Error saving shapes:", error);
  }
};

/**
 * Loads shapes from Firestore for a specific user's drawing using axios.
 * @param {string} userId - The ID of the user.
 * @param {string} drawingName - The name of the drawing.
 * @returns {Promise<any[]>} - The loaded shapes data.
 */
const loadShapes = async (
  userId: string,
  drawingName: string
): Promise<any[]> => {
  try {
    const response = await axiosInstance.post("/loadShapes", {
      userId,
      drawingName,
    });

    return response.data;
  } catch (error) {
    console.error("Error loading shapes:", error);
    return [];
  }
};

/**
 * Lists all drawings for a specific user from Firestore using axios.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string[]>} - A list of drawing names.
 */
const listDrawings = async (userId: string): Promise<string[]> => {
  try {
    const response = await axiosInstance.post("/listDrawings", {
      userId,
    });

    return response.data;
  } catch (error) {
    console.error("Error listing drawings:", error);
    return [];
  }
};

export { saveShapes, loadShapes, listDrawings };
