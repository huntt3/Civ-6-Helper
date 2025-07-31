import React, { useState, useEffect } from "react";
import CivModal from "../Templates/CivModal";

const DistrictPlannerModal = ({ open, onClose, onTileSelect, selectedHex }) => {
  const [tiles, setTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);

  // Load tiles data on component mount
  useEffect(() => {
    fetch("./jsonFiles/Tiles.json")
      .then((res) => res.json())
      .then((data) => setTiles(data.Tiles || []))
      .catch(() => setTiles([]));
  }, []);

  const handleConfirm = () => {
    if (selectedTile && selectedHex) {
      onTileSelect(selectedHex.id, selectedTile);
    }
    onClose();
  };

  const handleClose = () => {
    setSelectedTile(null);
    onClose();
  };

  const message = (
    <div className="max-h-64 overflow-y-auto">
      <p className="mb-4 text-sm text-gray-600">
        Select a tile type for hex at position ({selectedHex?.coords?.q},{" "}
        {selectedHex?.coords?.r}):
      </p>
      <div className="grid grid-cols-1 gap-2">
        {tiles.map((tile) => (
          <button
            key={tile.name}
            onClick={() => setSelectedTile(tile)}
            className={`p-2 text-left rounded border transition-colors ${
              selectedTile?.name === tile.name
                ? "bg-blue-100 border-blue-500 text-blue-900"
                : "bg-gray-50 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <div className="font-medium">{tile.name}</div>
            <div className="text-xs text-gray-500">{tile.type}</div>
            {tile.requirement && (
              <div className="text-xs text-gray-400">
                Requires: {tile.requirement}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <CivModal
      open={open}
      setOpen={handleClose}
      title="Select Tile Type"
      message={message}
      confirmText={
        selectedTile ? `Place ${selectedTile.name}` : "Select a tile"
      }
      onConfirm={handleConfirm}
    />
  );
};

export default DistrictPlannerModal;
