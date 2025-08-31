import React from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Component for the adjacency legend overlay
 */
const AdjacencyLegend = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

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
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>+1 Adjacency</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>+2 Adjacency</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>+3 Adjacency</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>+4+ Adjacency</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-300 rounded border border-blue-500"></div>
          <span>Range Highlight</span>
        </div>
      </div>
    </div>
  );
};

export default AdjacencyLegend;
