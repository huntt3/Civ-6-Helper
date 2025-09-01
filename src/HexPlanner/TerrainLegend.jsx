import React from "react";
import DraggablePanel from "../Templates/DraggablePanel";

/**
 * Component for the terrain legend overlay
 */
const TerrainLegend = ({ isVisible, onClose, position }) => {
  const terrainColors = [
    { name: "Plains", color: "#fbbf24" },
    { name: "Grassland", color: "#10b981" },
    { name: "Desert", color: "#f59e0b" },
    { name: "Tundra", color: "#6b7280" },
    { name: "Snow", color: "#ffffff" },
    { name: "Coast", color: "#7dd3fc" },
    { name: "Ocean", color: "#1e40af" },
  ];

  return (
    <DraggablePanel
      id="terrain-legend"
      title="Terrain Legend"
      isOpen={isVisible}
      onClose={onClose}
      position={position}
      maxWidth="200px"
    >
      <div className="space-y-2">
        {terrainColors.map((terrain) => (
          <div key={terrain.name} className="flex items-center space-x-3">
            {/* Terrain color indicator - pointy diamond shape */}
            <svg width="16" height="16" className="flex-shrink-0">
              <path
                d="M 8 2 L 14 8 L 8 14 L 2 8 Z"
                fill={terrain.color}
                stroke="#000000"
                strokeWidth="1"
              />
            </svg>
            <span className="text-xs text-gray-100">{terrain.name}</span>
          </div>
        ))}
      </div>
    </DraggablePanel>
  );
};

export default TerrainLegend;
