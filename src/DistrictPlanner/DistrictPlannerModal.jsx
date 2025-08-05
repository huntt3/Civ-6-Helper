import React, { useState, useEffect } from "react";

const DistrictPlannerModal = ({ open, onClose, onTileSelect, selectedHex }) => {
  const [tiles, setTiles] = useState([]);

  // Load tiles data on component mount
  useEffect(() => {
    fetch("./jsonFiles/Tiles.json")
      .then((res) => res.json())
      .then((data) => setTiles(data.Tiles || []))
      .catch(() => setTiles([]));
  }, []);

  const handleModalClose = () => {
    onClose();
  };

  const handleTileClick = (tile) => {
    // Directly place the tile and close modal when clicked
    if (selectedHex) {
      onTileSelect(selectedHex.id, tile);
    }
    onClose();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Select Tile Type</h2>
            <p className="mb-4 text-sm text-gray-600">
              Select a tile type for hex at position ({selectedHex?.coords?.q},{" "}
              {selectedHex?.coords?.r}):
            </p>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {tiles.map((tile) => (
                <button
                  key={tile.name}
                  onClick={() => handleTileClick(tile)}
                  className="p-2 text-left rounded border transition-colors bg-gray-50 border-gray-300 hover:bg-blue-100 hover:border-blue-500"
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
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DistrictPlannerModal;
