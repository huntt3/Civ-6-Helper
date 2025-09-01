import React from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Component for the terrain legend overlay
 */
const TerrainLegend = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

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
    <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-sm z-10 min-w-48">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold">Terrain Legend</h4>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white ml-2 p-1"
          aria-label="Close terrain legend"
        >
          <FaTimes size={12} />
        </button>
      </div>

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
            <span className="text-xs">{terrain.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerrainLegend;
