import React, { useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  addShape,
  setShapes,
} from "../redux/shapesSlice";
import { RootState, AppDispatch } from "../redux/store";
import { listDrawings, loadShapes, saveShapes } from "@/firebase/shapesService";
import RenderShape from "./RenderShape";
import ShapeButtons from "./ShapeButtons";
import SavedDrawings from "./SavedDrawings";
import CanvasTopControls from "./CanvasTopControls";

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
    const loadDrawings = async () => {
      const drawingsList = await listDrawings(userId);
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

  return (
    <div className="bg-gray-200 flex h-screen">
      <ShapeButtons handleShapeSelect={handleShapeSelect} />

      <div className="flex flex-col flex-grow m-10">
        <CanvasTopControls
          drawingName={drawingName}
          setDrawingName={setDrawingName}
          handleSave={handleSave}
          handleUpdate={handleUpdate}
          currentDrawing={currentDrawing}
        />

        <div className="border-2 border-gray-500">
          <Stage width={500} height={400} onClick={handleShapeDraw}>
            <Layer>
              {shapes.map((shape) => (
                <RenderShape key={shape.id} shape={shape} />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>

      <SavedDrawings
        drawings={drawings}
        handleLoadDrawing={handleLoadDrawing}
      />
    </div>
  );
};

export default Canvas;
