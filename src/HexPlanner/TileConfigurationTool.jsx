import React, { useState } from "react";
import TileTypeSelector from "./TileTypeSelector";
import TileItemSelector from "./TileItemSelector";

/**
 * Collapsible tile configuration tool that expands on hover
 * Provides interface for selecting tile types and items for the fill tool
 */
const TileConfigurationTool = ({
  selectedFillType,
  selectedFillItem,
  onFillTypeChange,
  onFillItemChange,
}) => {
  const [toolHovered, setToolHovered] = useState(false);

  return (
    <div
      className="transition-all duration-300 ease-in-out"
      onMouseEnter={() => setToolHovered(true)}
      onMouseLeave={() => setToolHovered(false)}
    >
      {/* Collapsed State - Show only active selection */}
      {!toolHovered && (
        <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-gray-300/80 hover:border-blue-400 transition-colors shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedFillItem ? (
                <span className="text-blue-700 font-medium">
                  Active: {selectedFillItem} ({selectedFillType})
                </span>
              ) : (
                "Hover to configure tiles"
              )}
            </span>
            <span className="text-xs text-gray-500">Hover to expand</span>
          </div>
        </div>
      )}

      {/* Expanded State - Full Configuration */}
      {toolHovered && (
        <div className="p-4 bg-white/85 backdrop-blur-sm rounded-lg border shadow-xl">
          <div className="mb-3">
            <h3 className="text-sm font-medium mb-2 text-gray-800">
              Tile Configuration Tool
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Select a tile type and item, then click hexes to apply.
              Right-click to clear the selected type.
            </p>
            {selectedFillItem && (
              <div className="text-xs text-blue-700 bg-blue-100/80 px-2 py-1 rounded mb-3">
                Active: {selectedFillItem} ({selectedFillType})
              </div>
            )}
          </div>

          <div className="space-y-3">
            {/* Type Selection */}
            <TileTypeSelector
              selectedFillType={selectedFillType}
              onFillTypeChange={onFillTypeChange}
              onFillItemChange={onFillItemChange}
            />

            {/* Item Selection */}
            <TileItemSelector
              selectedFillType={selectedFillType}
              selectedFillItem={selectedFillItem}
              onFillItemChange={onFillItemChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TileConfigurationTool;
