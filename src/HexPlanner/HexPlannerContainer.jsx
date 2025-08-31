import React, { useState, useRef, useEffect } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import CustomHexGrid from "./CustomHexGrid";
import HexPlannerModal from "./HexPlannerModal";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHex, setSelectedHex] = useState(null);
  const [currentTileData, setCurrentTileData] = useState(null);
  const [gridRadius, setGridRadius] = useState(() =>
    loadPageSpecificState(HEX_PLANNER_GRID_RADIUS_KEY, 7)
  );

  // Fill tool state
  const [fillMode, setFillMode] = useState(false);
  const [selectedFillType, setSelectedFillType] = useState("terrain");
  const [selectedFillItem, setSelectedFillItem] = useState(null);

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
    if (fillMode && selectedFillItem && clickType === "left") {
      // Fill mode: apply selected item directly
      const currentTileData =
        hexGridRef.current?.getHexTileData?.(hexId) || getDefaultTile();
      const newTileData = { ...currentTileData };

      // Apply the selected fill item
      if (selectedFillType === "terrain") {
        newTileData.terrain = selectedFillItem;
      } else if (selectedFillType === "feature") {
        // Clear conflicting items when placing features
        newTileData.district = null;
        newTileData.wonder = null;
        newTileData.feature = selectedFillItem;
      } else if (selectedFillType === "district") {
        // Clear conflicting items when placing districts
        newTileData.feature = null;
        newTileData.wonder = null;
        newTileData.district = selectedFillItem;
      } else if (selectedFillType === "tileImprovement") {
        newTileData.tileImprovement = selectedFillItem;
      }

      // Apply the changes
      handleTileSelect(hexId, newTileData);
    } else {
      // Normal mode or right-click: open modal for detailed configuration
      const tileData = hexGridRef.current?.getHexTileData?.(hexId) || null;
      setSelectedHex({ id: hexId, coords });
      setCurrentTileData(tileData);
      setModalOpen(true);
    }
  };
  const handleTileSelect = (hexId, tileData) => {
    if (hexGridRef.current && hexGridRef.current.updateHexTile) {
      hexGridRef.current.updateHexTile(hexId, tileData);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedHex(null);
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
          {/* Fill Tool Section */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fillMode}
                  onChange={(e) => setFillMode(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm font-medium">Fill Tool Mode</span>
              </label>
              {fillMode && (
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Click hexes to apply:{" "}
                  {selectedFillItem || "Select an item below"}
                </span>
              )}
            </div>

            {fillMode && (
              <div className="space-y-3">
                {/* Fill Type Selection */}
                <div className="flex gap-2 flex-wrap">
                  {["terrain", "feature", "district", "tileImprovement"].map(
                    (type) => (
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
                          : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    )
                  )}
                </div>

                {/* Fill Item Selection */}
                {selectedFillType && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 capitalize">
                      Select{" "}
                      {selectedFillType === "tileImprovement"
                        ? "Tile Improvement"
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
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {fillMode
                ? `Fill mode: Click hexes to apply ${
                    selectedFillItem || "selected item"
                  }. Right-click or disable fill mode for detailed configuration.`
                : "Click on any hex to configure terrain, districts, features, and rivers. Use scroll wheel to zoom, drag to pan."}
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

      <HexPlannerModal
        open={modalOpen}
        onClose={handleModalClose}
        onTileSelect={handleTileSelect}
        selectedHex={selectedHex}
        currentTileData={currentTileData}
      />
    </>
  );
};

export default HexPlannerContainer;
