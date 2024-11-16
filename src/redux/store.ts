import { configureStore } from "@reduxjs/toolkit";
import shapesReducer from "./shapesSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    shapes: shapesReducer,
    user: userReducer,
  },
});

// Subscribe to store updates and log the state changes
store.subscribe(() => {
  console.log("State updated:", store.getState());
});

export type RootState = ReturnType<typeof store.getState>; // To type the state in components
export type AppDispatch = typeof store.dispatch; // To type dispatch in components

export default store;
