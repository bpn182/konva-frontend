import React, { useEffect, useState } from "react";
import { Stage, Layer, Circle, Rect } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  addShape,
  updateShapePosition,
  undo,
  redo,
  clearCanvas,
  setShapes,
} from "../redux/shapesSlice";
import { RootState, AppDispatch } from "../redux/store";
import { listDrawings, loadShapes, saveShapes } from "@/firebase/shapesService";
import Logout from "./Logout";

interface ShapeProperties {
  radius: number;
  width: number;
  height: number;
}

const Canvas: React.FC = () => {
  const [drawingShape, setDrawingShape] = useState<
    "circle" | "rectangle" | "line" | null
  >(null);
  const [shapeProperties, setShapeProperties] = useState<ShapeProperties>({
    radius: 30,
    width: 60,
    height: 40,
  });
  const dispatch = useDispatch<AppDispatch>();
  const shapes = useSelector((state: RootState) => state.shapes.shapes);
  const userId = useSelector((state: RootState) => state.user.userId) as string;
  const [drawingName, setDrawingName] = useState("");
  const [drawings, setDrawings] = useState<string[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialShapes = async () => {
      const loadedShapes = await loadShapes(userId, "default");
      dispatch(setShapes(loadedShapes));
    };
    loadInitialShapes();
    const loadDrawings = async () => {
      const drawingsList = await listDrawings(userId);
      console.log("listDrawings", drawingsList);
      setDrawings(drawingsList);
    };
    loadDrawings();
  }, [dispatch, userId]);

  const handleSave = async () => {
    if (drawingName) {
      const drawingsList = await listDrawings(userId);
      if (drawingsList.includes(drawingName)) {
        alert("Drawing name already exists. Please choose a different name.");
      } else {
        await saveShapes(userId, drawingName, shapes);
        setDrawings(drawingsList);
        setDrawingName("");
      }
    } else {
      alert("Please enter a drawing name.");
    }
  };

  const handleShapeDraw = (e: any) => {
    if (!drawingShape) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const newShape = {
      id: Date.now().toString(), // Generate a unique ID based on the timestamp
      x: pointerPosition.x,
      y: pointerPosition.y,
      shapeType: drawingShape,
      radius: shapeProperties.radius, // for circle
      width: shapeProperties.width, // for rectangle
      height: drawingShape === "line" ? 2 : shapeProperties.height, // for line
    };
    // Dispatch action to add the shape to Redux store
    dispatch(addShape(newShape));
  };

  const handleShapeSelect = (
    shapeType: "circle" | "rectangle" | "line" | null
  ) => {
    setDrawingShape(shapeType);
    if (shapeType === "circle") {
      setShapeProperties({ radius: 30, width: 0, height: 0 });
    } else if (shapeType === "rectangle") {
      setShapeProperties({ radius: 0, width: 60, height: 40 });
    } else if (shapeType === "line") {
      setShapeProperties({ radius: 0, width: 60, height: 4 });
    }
  };

  const handleDragEnd = (e: any, id: string) => {
    const { x, y } = e.target.position();
    dispatch(updateShapePosition({ id, x, y }));
  };

  const handleLoadDrawing = async (name: string) => {
    const loadedShapes = await loadShapes(userId, name);
    dispatch(setShapes(loadedShapes));
    setCurrentDrawing(name);
  };

  const handleUpdate = async () => {
    if (currentDrawing) {
      await saveShapes(userId, currentDrawing, shapes);
      const drawingsList = await listDrawings(userId);
      setDrawings(drawingsList);
    }
  };

  const renderShape = (shape: any) => {
    switch (shape.shapeType) {
      case "circle":
        return (
          <Circle
            key={shape.id}
            x={shape.x}
            y={shape.y}
            radius={shape.radius}
            fill="red"
            draggable
            onDragEnd={(e) => handleDragEnd(e, shape.id)}
          />
        );
      case "rectangle":
        return (
          <Rect
            key={shape.id}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill="blue"
            draggable
            onDragEnd={(e) => handleDragEnd(e, shape.id)}
          />
        );
      case "line":
        return (
          <Rect
            key={shape.id}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill="green"
            draggable
            onDragEnd={(e) => handleDragEnd(e, shape.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-200 flex h-screen">
      <div className="flex flex-col items-center space-y-8 p-4 mt-20">
        <button
          onClick={() => {
            handleShapeSelect(null); // Set drawingShape to null
          }}
          className="border border-black text-black px-4 py-2 rounded hover:bg-yellow-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M15.232 2.232a1 1 0 011.414 0l5.122 5.122a1 1 0 010 1.414l-12 12a1 1 0 01-.707.293H4a1 1 0 01-1-1v-4.95a1 1 0 01.293-.707l12-12zM4 19v1h1l11.293-11.293-1-1L4 19z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={() => handleShapeSelect("circle")}
          className="bg-red-500 text-white w-16 h-16 rounded-full hover:bg-blue-700"
        ></button>
        <button
          onClick={() => handleShapeSelect("rectangle")}
          className="bg-blue-500 text-white w-16 h-12 rounded hover:bg-green-700"
        ></button>
        <button
          onClick={() => handleShapeSelect("line")}
          className="bg-green-500 text-white w-16 h-2 rounded hover:bg-red-700"
        ></button>
      </div>

      <div className="flex flex-col flex-grow m-10">
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
            className="border border-gray-400 px-2 py-1 rounded"
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
          <button
            onClick={() => {
              handleShapeSelect(null); // Set drawingShape to null
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M15.232 2.232a1 1 0 011.414 0l5.122 5.122a1 1 0 010 1.414l-12 12a1 1 0 01-.707.293H4a1 1 0 01-1-1v-4.95a1 1 0 01.293-.707l12-12zM4 19v1h1l11.293-11.293-1-1L4 19z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="border-2 border-gray-500">
          <Stage width={500} height={400} onClick={handleShapeDraw}>
            <Layer>{shapes.map((shape) => renderShape(shape))}</Layer>
          </Stage>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 p-4 mt-20">
        <h2 className="text-lg text-black font-bold">Saved Drawings</h2>
        {drawings.map((drawing) => (
          <button
            key={drawing}
            onClick={() => handleLoadDrawing(drawing)}
            className="border text-black border-gray-400 px-4 py-2 rounded hover:bg-gray-300"
          >
            {drawing}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
