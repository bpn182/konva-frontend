import React, { useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { addShape, setShapes } from "../redux/shapesSlice";
import { RootState, AppDispatch } from "../redux/store";
import { listDrawings, loadShapes, saveShapes } from "@/firebase/shapesService";
import RenderShape from "./RenderShape";
import ShapeButtons from "./ShapeButtons";
import SavedDrawings from "./SavedDrawings";
import CanvasTopControls from "./CanvasTopControls";
import { ShapeNames } from "@/interfaces";

interface ShapeProperties {
  radius: number;
  width: number;
  height: number;
}

const Canvas: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const shapes = useSelector((state: RootState) => state.shapes.shapes);
  const userId = useSelector((state: RootState) => state.user.userId) as string;
  const [drawingName, setDrawingName] = useState("");
  const [drawings, setDrawings] = useState<string[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<string | null>(null);
  const [drawingShape, setDrawingShape] = useState<ShapeNames>(null);
  const [shapeProperties, setShapeProperties] = useState<ShapeProperties>({
    radius: 30,
    width: 60,
    height: 40,
  });

  useEffect(() => {
    const loadDrawings = async () => {
      // Fetch the list of drawings from Firestore for the current user
      const drawingsList = await listDrawings(userId);
      // Update the state with the fetched drawings list
      setDrawings(drawingsList);
    };

    loadDrawings();
  }, [dispatch, userId]);

  /**
   * Handles saving the current shapes to Firestore under a specified drawing name.
   * If the drawing name already exists, an alert is shown.
   * Otherwise, the shapes are saved and the drawings list is updated.
   */
  const handleSave = async () => {
    if (drawingName) {
      // Fetch the list of existing drawings for the user
      const drawingsList = await listDrawings(userId);
      if (drawingsList.includes(drawingName)) {
        // Alert if the drawing name already exists
        alert("Drawing name already exists. Please choose a different name.");
      } else {
        // Save the shapes under the specified drawing name
        await saveShapes(userId, drawingName, shapes);
        // Update the drawings list and clear the drawing name input
        setDrawings(drawingsList);
        setDrawingName("");
      }
    } else {
      // Alert if no drawing name is entered
      alert("Please enter a drawing name.");
    }
  };

  // Handles drawing a new shape on the canvas.
  const handleShapeDraw = (e: any) => {
    if (!drawingShape) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const newShape = {
      id: Date.now().toString(),
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

  // Handles selecting a shape type and setting its properties
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

  // Handles loading a drawing by its name
  const handleLoadDrawing = async (name: string) => {
    const loadedShapes = await loadShapes(userId, name);

    // Update the Redux store with the loaded shapes
    dispatch(setShapes(loadedShapes));
    setCurrentDrawing(name);
  };

  // Handles updating the current drawing with the latest shapes
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
