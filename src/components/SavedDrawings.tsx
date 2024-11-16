import React from "react";

interface SavedDrawingsProps {
  drawings: string[];
  handleLoadDrawing: (name: string) => void;
}

const SavedDrawings: React.FC<SavedDrawingsProps> = ({
  drawings,
  handleLoadDrawing,
}) => {
  return (
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
  );
};

export default SavedDrawings;
