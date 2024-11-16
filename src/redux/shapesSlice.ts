import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for the shape properties
interface Shape {
  id: string;
  x: number;
  y: number;
  shapeType: "circle" | "rectangle" | "line";
  radius: number;
  width: number;
  height: number;
}

// Define the initial state for shapes
interface ShapesState {
  shapes: Shape[];
  undoStack: Shape[][];
  redoStack: Shape[][];
}

const initialState: ShapesState = {
  shapes: [],
  undoStack: [],
  redoStack: [],
};

// Create the shapes slice using createSlice
const shapesSlice = createSlice({
  name: "shapes",
  initialState,
  reducers: {
    // Action to add a new shape
    addShape: (state, action: PayloadAction<Shape>) => {
      state.undoStack.push([...state.shapes]);
      state.shapes.push(action.payload);
      state.redoStack = []; // Clear redo stack on new action
    },
    setShapes: (state, action: PayloadAction<Shape[]>) => {
      state.shapes = action.payload;
    },
    deleteShape: (state, action: PayloadAction<string>) => {
      state.undoStack.push([...state.shapes]);
      state.shapes = state.shapes.filter(
        (shape) => shape.id !== action.payload
      );
      state.redoStack = []; // Clear redo stack on new action
    },
    updateShapePosition: (
      state,
      action: PayloadAction<{ id: string; x: number; y: number }>
    ) => {
      const shape = state.shapes.find(
        (shape) => shape.id === action.payload.id
      );
      if (shape) {
        shape.x = action.payload.x;
        shape.y = action.payload.y;
      }
      state.redoStack = []; // Clear redo stack on new action
    },
    // Action to remove a shape by its id
    removeShape: (state, action: PayloadAction<string>) => {
      state.shapes = state.shapes.filter(
        (shape) => shape.id !== action.payload
      );
    },

    undo: (state) => {
      if (state.undoStack.length > 0) {
        const previousState = state.undoStack.pop();
        if (previousState) {
          state.redoStack.push([...state.shapes]);
          state.shapes = previousState;
        }
      }
    },
    redo: (state) => {
      if (state.redoStack.length > 0) {
        const nextState = state.redoStack.pop();
        if (nextState) {
          state.undoStack.push([...state.shapes]);
          state.shapes = nextState;
        }
      }
    },
    clearCanvas: (state) => {
      state.undoStack.push([...state.shapes]);
      state.shapes = [];
      state.redoStack = []; // Clear redo stack on new action
    },
  },
});

// Export actions
export const {
  addShape,
  setShapes,
  deleteShape,
  updateShapePosition,
  undo,
  redo,
  clearCanvas,
} = shapesSlice.actions;

// Export the reducer
export default shapesSlice.reducer;
