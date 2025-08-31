import React, { useState, useRef, useEffect } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import CustomHexGrid from "./CustomHexGrid";
import { getTileCategories, getDefaultTile } from "../utils/hexPlannerUtils";
import {
  loadPageSpecificState,
  savePageSpecificState,
  getDefaultCollapsedState,
  removePageSpecificState,
} from "../utils/pageContext";

// Base keys for localStorage (will be made page-specific)
const HEX_PLANNER_GRID_RADIUS_KEY = "civ6-helper-hex-planner-grid-radius";
const HEX_PLANNER_COLLAPSED_KEY = "civ6-helper-hex-planner-collapsed";

const HexPlannerContainer = () => {
  const [collapsed, setCollapsed] = useState(() =>
    loadPageSpecificState(HEX_PLANNER_COLLAPSED_KEY, getDefaultCollapsedState())
  );
  const [gridRadius, setGridRadius] = useState(() =>
    loadPageSpecificState(HEX_PLANNER_GRID_RADIUS_KEY, 7)
  );

  // Fill tool state
  const [selectedFillType, setSelectedFillType] = useState("terrain");
  const [selectedFillItem, setSelectedFillItem] = useState(null);

  // Tool hover state for collapsible behavior
  const [toolHovered, setToolHovered] = useState(false);

  // Legend visibility state
  const [showLegend, setShowLegend] = useState(true);

  const hexGridRef = useRef(null);

  // Save grid radius to localStorage
  useEffect(() => {
    savePageSpecificState(HEX_PLANNER_GRID_RADIUS_KEY, gridRadius);
  }, [gridRadius]);

  // Save collapsed state to localStorage
  useEffect(() => {
    savePageSpecificState(HEX_PLANNER_COLLAPSED_KEY, collapsed);
  }, [collapsed]);

  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const handleHexClick = (hexId, coords, clickType = "left") => {
    if (!selectedFillItem) return; // Only allow interaction when an item is selected

    const currentTileData =
      hexGridRef.current?.getHexTileData?.(hexId) || getDefaultTile();
    const newTileData = { ...currentTileData };

    if (clickType === "right") {
      // Right-click: clear the selected type
      if (selectedFillType === "terrain") {
        newTileData.terrain = null;
      } else if (selectedFillType === "feature") {
        newTileData.feature = null;
      } else if (selectedFillType === "district") {
        newTileData.district = null;
      } else if (selectedFillType === "wonder") {
        newTileData.wonder = null;
      } else if (selectedFillType === "naturalWonder") {
        newTileData.naturalWonder = null;
      } else if (selectedFillType === "tileImprovement") {
        newTileData.tileImprovement = null;
      }
    } else {
      // Left-click: apply selected item
      if (selectedFillType === "terrain") {
        newTileData.terrain = selectedFillItem;
      } else if (selectedFillType === "feature") {
        // Clear conflicting items when placing features
        newTileData.district = null;
        newTileData.wonder = null;
        newTileData.naturalWonder = null;
        newTileData.feature = selectedFillItem;
      } else if (selectedFillType === "district") {
        // Clear conflicting items when placing districts
        newTileData.feature = null;
        newTileData.wonder = null;
        newTileData.naturalWonder = null;
        newTileData.district = selectedFillItem;
      } else if (selectedFillType === "wonder") {
        // Clear conflicting items when placing wonders
        newTileData.feature = null;
        newTileData.district = null;
        newTileData.naturalWonder = null;
        newTileData.wonder = selectedFillItem;
      } else if (selectedFillType === "naturalWonder") {
        // Clear conflicting items when placing natural wonders
        newTileData.feature = null;
        newTileData.district = null;
        newTileData.wonder = null;
        newTileData.naturalWonder = selectedFillItem;
      } else if (selectedFillType === "tileImprovement") {
        newTileData.tileImprovement = selectedFillItem;
      }
    }

    // Apply the changes
    handleTileSelect(hexId, newTileData);
  };
  const handleTileSelect = (hexId, tileData) => {
    if (hexGridRef.current && hexGridRef.current.updateHexTile) {
      hexGridRef.current.updateHexTile(hexId, tileData);
    }
  };

  const handleModalClose = () => {
    // Modal functionality removed - no longer needed
  };

  const handleRadiusChange = (newRadius) => {
    setGridRadius(newRadius);
  };

  const handleReset = () => {
    // Reset hex grid view and clear tiles
    if (hexGridRef.current && hexGridRef.current.resetView) {
      hexGridRef.current.resetView();
    }
    // Clear localStorage hex tile data
    if (hexGridRef.current && hexGridRef.current.clearHexData) {
      hexGridRef.current.clearHexData();
    }
    // Reset grid radius to default only
    setGridRadius(7);
    removePageSpecificState(HEX_PLANNER_GRID_RADIUS_KEY);

    // Force re-render of hex grid by changing radius slightly and back
    setGridRadius((prev) => (prev === 7 ? 7.1 : 7));
    setTimeout(() => setGridRadius(7), 100);
  };
  const handleResetView = () => {
    // Just reset view without clearing tiles
    if (hexGridRef.current && hexGridRef.current.resetView) {
      hexGridRef.current.resetView();
    }
  };

  return (
    <>
      <CollapsibleContainer
        title="Hex Planner"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        onRefresh={handleReset}
        ariaLabel="Hex Planner"
      >
        <div className="p-4">
          {/* Tile Configuration Tool - Collapsible on Hover */}
          <div
            className="mb-4 transition-all duration-300 ease-in-out"
            onMouseEnter={() => setToolHovered(true)}
            onMouseLeave={() => setToolHovered(false)}
          >
            {/* Collapsed State - Show only active selection */}
            {!toolHovered && (
              <div className="p-2 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
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
              <div className="p-4 bg-gray-50 rounded-lg border shadow-lg">
                <div className="mb-3">
                  <h3 className="text-sm font-medium mb-2">
                    Tile Configuration Tool
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Select a tile type and item, then click hexes to apply.
                    Right-click to clear the selected type.
                  </p>
                  {selectedFillItem && (
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded mb-3">
                      Active: {selectedFillItem} ({selectedFillType})
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Type Selection */}
                  <div className="flex gap-2 flex-wrap">
                    {[
                      "terrain",
                      "feature",
                      "district",
                      "wonder",
                      "naturalWonder",
                      "tileImprovement",
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedFillType(type);
                          setSelectedFillItem(null);
                        }}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          selectedFillType === type
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {type === "tileImprovement"
                          ? "Improvements"
                          : type === "naturalWonder"
                          ? "Natural Wonders"
                          : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Item Selection */}
                  {selectedFillType && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 capitalize">
                        Select{" "}
                        {selectedFillType === "tileImprovement"
                          ? "Tile Improvement"
                          : selectedFillType === "naturalWonder"
                          ? "Natural Wonder"
                          : selectedFillType}
                        :
                      </h4>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                        {getTileCategories()
                          .find((cat) => cat.key === selectedFillType)
                          ?.items.map((item) => (
                            <button
                              key={item}
                              onClick={() => setSelectedFillItem(item)}
                              className={`p-2 text-xs rounded border transition-colors ${
                                selectedFillItem === item
                                  ? "bg-blue-100 border-blue-500 text-blue-900"
                                  : "bg-white border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {selectedFillItem
                ? `Click hexes to apply ${selectedFillItem}. Right-click to clear ${selectedFillType}.`
                : "Select a tile type and item above to start configuring hexes."}
            </p>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={handleResetView}
                className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset View
              </button>
              <label className="text-sm font-medium text-gray-700">
                Grid Size:
              </label>
              <select
                value={gridRadius}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2}>Small (2)</option>
                <option value={3}>Medium (3)</option>
                <option value={4}>Large (4)</option>
                <option value={5}>Extra Large (5)</option>
                <option value={6}>Extra Large (6)</option>
                <option value={7}>Huge (7)</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <CustomHexGrid
              ref={hexGridRef}
              onHexClick={handleHexClick}
              radius={gridRadius}
            />
            {/* Adjacency Bonus Legend Overlay */}
            {showLegend && (
              <div className="absolute bottom-2 left-2 text-xs text-gray-700 pointer-events-none">
                <div className="relative pointer-events-auto">
                  <button
                    onClick={() => setShowLegend(false)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold"
                    title="Close legend"
                  >
                    ×
                  </button>
                  <div className="pr-3">
                    <p className="font-semibold mb-1">
                      Adjacency Bonus Legend:
                    </p>
                    <p>• Minor adjacencies: +0.5 yield</p>
                    <p>• Normal adjacencies: +1 yield</p>
                    <p>• Major adjacencies: +2 yield</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {!showLegend && (
            <div className="mt-2">
              <button
                onClick={() => setShowLegend(true)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Show Adjacency Legend
              </button>
            </div>
          )}
        </div>
      </CollapsibleContainer>
    </>
  );
};

export default HexPlannerContainer;
