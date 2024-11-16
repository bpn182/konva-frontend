import { updateShapePosition } from "@/redux/shapesSlice";
import { AppDispatch } from "@/redux/store";
import React from "react";
import { Circle, Rect } from "react-konva";
import { useDispatch } from "react-redux";

interface Shape {
  id: string;
  shapeType: "circle" | "rectangle" | "line";
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
}

interface RenderShapeProps {
  shape: Shape;
}

const RenderShape = ({ shape }: RenderShapeProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDragEnd = (e: any, id: string) => {
    const { x, y } = e.target.position();
    dispatch(updateShapePosition({ id, x, y }));
  };

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

export default RenderShape;
