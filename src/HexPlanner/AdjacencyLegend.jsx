import React, { useState, useEffect } from "react";
import DraggablePanel from "../Templates/DraggablePanel";

/**
 * Component for the adjacency legend overlay
 */
const AdjacencyLegend = ({
  isVisible,
  onClose,
  selectedFillType,
  selectedFillItem,
  position,
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

  const shouldShow = isVisible && hasAdjacencyBonuses();

  return (
    <DraggablePanel
      id="adjacency-legend"
      title="Adjacency Legend"
      isOpen={shouldShow}
      onClose={onClose}
      position={position}
      maxWidth="220px"
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-100">
            • Minor adjacencies: +0.5 yield
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-100">
            • Normal adjacencies: +1 yield
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-100">
            • Major adjacencies: +2 yield
          </span>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default AdjacencyLegend;
