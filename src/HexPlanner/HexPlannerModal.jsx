import React, { useState, useEffect } from "react";

const HexPlannerModal = ({ open, onClose, onTileSelect, selectedHex }) => {
  const [tiles, setTiles] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("./jsonFiles/Tiles.json")
      .then((res) => res.json())
      .then((data) => setTiles(data.Tiles || []))
      .catch(() => setTiles([]));
  }, []);

  const handleTileClick = (tile) => {
    if (selectedHex) {
      onTileSelect(selectedHex.id, tile);
    }
    onClose();
  };

  const filteredTiles = tiles.filter((tile) => {
    if (filter === "all") return true;
    return tile.type === filter;
  });

  const tileTypes = [...new Set(tiles.map((tile) => tile.type))];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Select Tile Type</h2>
            <p className="mb-4 text-sm text-gray-600">
              Select a tile type for hex at position ({selectedHex?.coords?.q},{" "}
              {selectedHex?.coords?.r}):
            </p>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-xs rounded ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {tileTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 text-xs rounded ${
                    filter === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Tile grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 max-h-60 overflow-y-auto">
              {filteredTiles.map((tile) => (
                <button
                  key={tile.name}
                  onClick={() => handleTileClick(tile)}
                  className="p-3 text-left rounded border transition-colors bg-gray-50 border-gray-300 hover:bg-blue-100 hover:border-blue-500"
                >
                  <div className="font-medium text-sm">{tile.name}</div>
                  <div className="text-xs text-gray-500 mb-1">{tile.type}</div>
                  {tile.requirement && (
                    <div className="text-xs text-gray-400 mb-1">
                      Requires: {tile.requirement}
                    </div>
                  )}
                  {tile.appeal !== undefined && (
                    <div className="text-xs text-gray-600">
                      Appeal:{" "}
                      {tile.appeal > 0 ? `+${tile.appeal}` : tile.appeal}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
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

export default HexPlannerModal;
