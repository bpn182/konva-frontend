import React from "react";
import { useDispatch } from "react-redux";
import { undo, redo, clearCanvas } from "../redux/shapesSlice";
import Logout from "./Logout";

interface CanvasControlsProps {
  drawingName: string;
  setDrawingName: (name: string) => void;
  handleSave: () => void;
  handleUpdate: () => void;
  currentDrawing: string | null;
}

const CanvasTopControls: React.FC<CanvasControlsProps> = ({
  drawingName,
  setDrawingName,
  handleSave,
  handleUpdate,
  currentDrawing,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="flex space-x-4 p-4">
      <button
        onClick={() => dispatch(undo())}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Undo
      </button>
      <button
        onClick={() => dispatch(redo())}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Redo
      </button>
      <button
        onClick={() => dispatch(clearCanvas())}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Clear Canvas
      </button>
      <input
        type="text"
        value={drawingName}
        onChange={(e) => setDrawingName(e.target.value)}
        placeholder="Drawing Name"
        className="border border-gray-400 px-2 py-1 rounded text-black"
      />
      <button
        onClick={handleSave}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Save
      </button>
      {currentDrawing && (
        <button
          onClick={handleUpdate}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Update
        </button>
      )}
      <Logout />
    </div>
  );
};

export default CanvasTopControls;
