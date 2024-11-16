import React from "react";

interface ShapeButtonsProps {
  handleShapeSelect: (
    shapeType: "circle" | "rectangle" | "line" | null
  ) => void;
}

const ShapeButtons: React.FC<ShapeButtonsProps> = ({ handleShapeSelect }) => {
  return (
    <div className="flex flex-col items-center space-y-8 p-4 mt-20">
      <button
        onClick={() => handleShapeSelect(null)}
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
  );
};

export default ShapeButtons;
