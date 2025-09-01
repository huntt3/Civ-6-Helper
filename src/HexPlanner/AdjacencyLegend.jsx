import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Component for the adjacency legend overlay
 */
const AdjacencyLegend = ({
  isVisible,
  onClose,
  selectedFillType,
  selectedFillItem,
}) => {
  const [tiles, setTiles] = useState([]);

  // Load tiles data on component mount
  useEffect(() => {
    fetch("./jsonFiles/Tiles.json")
      .then((res) => res.json())
      .then((data) => setTiles(data.Tiles || []))
      .catch(() => setTiles([]));
  }, []);

  // Check if the selected item has adjacency bonuses
  const hasAdjacencyBonuses = () => {
    if (selectedFillType !== "district" || !selectedFillItem || !tiles.length) {
      return false;
    }

    const tileData = tiles.find((tile) => tile.name === selectedFillItem);
    if (!tileData) return false;

    return !!(
      tileData.districtMinorAdjacencies ||
      tileData.otherMinorAdjacencies ||
      tileData.normalAdjacencies ||
      tileData.majorAdjacencies
    );
  };

  if (!isVisible || !hasAdjacencyBonuses()) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-sm z-10 min-w-48">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold">Adjacency Legend</h4>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white ml-2 p-1"
          aria-label="Close legend"
        >
          <FaTimes size={12} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span>• Minor adjacencies: +0.5 yield</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>• Normal adjacencies: +1 yield</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>• Major adjacencies: +2 yield</span>
        </div>
      </div>
    </div>
  );
};

export default AdjacencyLegend;
