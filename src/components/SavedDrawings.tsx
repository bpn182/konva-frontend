import React from "react";

interface SavedDrawingsProps {
  drawings: string[];
  handleLoadDrawing: (name: string) => void;
  currentDrawing: string | null;
}

const SavedDrawings: React.FC<SavedDrawingsProps> = ({
  drawings,
  handleLoadDrawing,
  currentDrawing,
}) => {
  return (
    <div className="flex flex-col justify-start text-black space-y-4 p-4 mt-20">
      <h2 className="text-lg  font-bold">Saved Drawings</h2>
      {drawings.map((drawing) => (
        <button
          key={drawing}
          onClick={() => handleLoadDrawing(drawing)}
          className={`border px-4 py-2 rounded hover:bg-gray-300 ${
            drawing === currentDrawing ? "bg-green-500" : "border-gray-400"
          }`}
        >
          {drawing}
        </button>
      ))}
    </div>
  );
};

export default SavedDrawings;
