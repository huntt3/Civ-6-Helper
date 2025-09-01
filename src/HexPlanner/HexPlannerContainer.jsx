import React, { useState, useRef, useEffect } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import CustomHexGrid from "./CustomHexGrid";
import TileConfigurationTool from "./TileConfigurationTool";
import AdjacencyLegend from "./AdjacencyLegend";
import TerrainLegend from "./TerrainLegend";
import AdjacencySettings from "./AdjacencySettings";
import CityStateSuzerainSettings from "./CityStateSuzerainSettings";
import {
  loadPageSpecificState,
  savePageSpecificState,
  getDefaultCollapsedState,
  removePageSpecificState,
} from "../utils/pageContext";
import { getDefaultTile } from "../utils/hexPlannerUtils";

// Base keys for localStorage (will be made page-specific)
const HEX_PLANNER_GRID_RADIUS_KEY = "civ6-helper-hex-planner-grid-radius";
const HEX_PLANNER_COLLAPSED_KEY = "civ6-helper-hex-planner-collapsed";

const HexPlannerContainer = ({ settings }) => {
  const [collapsed, setCollapsed] = useState(() =>
    loadPageSpecificState(HEX_PLANNER_COLLAPSED_KEY, getDefaultCollapsedState())
  );
  const [gridRadius, setGridRadius] = useState(() =>
    loadPageSpecificState(HEX_PLANNER_GRID_RADIUS_KEY, 7)
  );

  // Fill tool state
  const [selectedFillType, setSelectedFillType] = useState("terrain");
  const [selectedFillItem, setSelectedFillItem] = useState(null);

  // Legend visibility states
  const [showLegend, setShowLegend] = useState(true);
  const [showTerrainLegend, setShowTerrainLegend] = useState(false);
  const [showAdjacencySettings, setShowAdjacencySettings] = useState(false);
  const [showCityStateSettings, setShowCityStateSettings] = useState(false);

  // Settings states
  const [adjacencySettings, setAdjacencySettings] = useState({});
  const [cityStateSettings, setCityStateSettings] = useState({});

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
    // Don't handle hex clicks when in river mode - use edge clicks instead
    if (selectedFillType === "river") return;

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

  const handleEdgeClick = (hexId, edge, clickType = "left") => {
    if (selectedFillType !== "river") return;

    const currentTileData =
      hexGridRef.current?.getHexTileData?.(hexId) || getDefaultTile();
    const newTileData = { ...currentTileData };

    // Ensure hasRiverEdges object exists
    if (!newTileData.hasRiverEdges) {
      newTileData.hasRiverEdges = {
        northeast: false,
        east: false,
        southeast: false,
        southwest: false,
        west: false,
        northwest: false,
      };
    }

    if (clickType === "right") {
      // Right-click: remove river edge
      newTileData.hasRiverEdges = {
        ...newTileData.hasRiverEdges,
        [edge]: false,
      };
    } else {
      // Left-click: toggle river edge
      newTileData.hasRiverEdges = {
        ...newTileData.hasRiverEdges,
        [edge]: !newTileData.hasRiverEdges[edge],
      };
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
          <TileConfigurationTool
            selectedFillType={selectedFillType}
            selectedFillItem={selectedFillItem}
            onFillTypeChange={setSelectedFillType}
            onFillItemChange={setSelectedFillItem}
          />

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {selectedFillItem
                ? selectedFillType === "river"
                  ? "Click on hex edges to add/remove rivers. Right-click edges to remove."
                  : `Click hexes to apply ${selectedFillItem}. Right-click to clear ${selectedFillType}.`
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
              onEdgeClick={handleEdgeClick}
              selectedFillType={selectedFillType}
              radius={gridRadius}
              settings={settings}
              adjacencySettings={adjacencySettings}
              cityStateSettings={cityStateSettings}
            />
            {/* Adjacency Legend Component */}
            <AdjacencyLegend
              isVisible={showLegend}
              onClose={() => setShowLegend(false)}
              selectedFillType={selectedFillType}
              selectedFillItem={selectedFillItem}
            />
            {/* Terrain Legend Component */}
            <TerrainLegend
              isVisible={showTerrainLegend}
              onClose={() => setShowTerrainLegend(false)}
            />
            {/* Adjacency Settings Component */}
            <AdjacencySettings
              isVisible={showAdjacencySettings}
              onClose={() => setShowAdjacencySettings(false)}
              settings={settings}
              onSettingsChange={setAdjacencySettings}
            />
            {/* City-State Suzerain Settings Component */}
            <CityStateSuzerainSettings
              isVisible={showCityStateSettings}
              onClose={() => setShowCityStateSettings(false)}
              onSettingsChange={setCityStateSettings}
            />
          </div>
          <div className="flex gap-2 mt-2">
            {!showLegend && (
              <button
                onClick={() => setShowLegend(true)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Show Adjacency Legend
              </button>
            )}
            {!showTerrainLegend && (
              <button
                onClick={() => setShowTerrainLegend(true)}
                className="text-xs text-green-600 hover:text-green-800 underline"
              >
                Show Terrain Legend
              </button>
            )}
            {!showAdjacencySettings && (
              <button
                onClick={() => setShowAdjacencySettings(true)}
                className="text-xs text-purple-600 hover:text-purple-800 underline"
              >
                Show Adjacency Settings
              </button>
            )}
            {!showCityStateSettings && (
              <button
                onClick={() => setShowCityStateSettings(true)}
                className="text-xs text-orange-600 hover:text-orange-800 underline"
              >
                Show City-State Settings
              </button>
            )}
          </div>
        </div>
      </CollapsibleContainer>
    </>
  );
};

export default HexPlannerContainer;
