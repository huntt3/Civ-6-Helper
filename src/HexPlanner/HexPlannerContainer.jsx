import React, { useState, useRef, useEffect } from "react";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import CustomHexGrid from "./CustomHexGrid";
import TileConfigurationTool from "./TileConfigurationTool";
import AdjacencyLegend from "./AdjacencyLegend";
import TerrainLegend from "./TerrainLegend";
import AdjacencySettings from "./AdjacencySettings";
import CityStateSuzerainSettings from "./CityStateSuzerainSettings";
import KeybindSettings from "./KeybindSettings";
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
  const [showKeybindSettings, setShowKeybindSettings] = useState(false);

  // Settings states
  const [adjacencySettings, setAdjacencySettings] = useState({});
  const [cityStateSettings, setCityStateSettings] = useState({});
  const [keybindSettings, setKeybindSettings] = useState({});

  // Panel position states
  const [panelPositions, setPanelPositions] = useState({
    "adjacency-legend": { x: 20, y: 250 },
    "terrain-legend": { x: 20, y: 400 },
    "adjacency-settings": { x: 350, y: 120 },
    "citystate-settings": { x: 20, y: 120 },
    "keybind-settings": { x: 350, y: 320 },
  });

  const hexGridRef = useRef(null);

  // Load panel positions from localStorage
  useEffect(() => {
    const savedPositions = localStorage.getItem(
      "civ6-helper-hex-planner-panel-positions"
    );
    if (savedPositions) {
      setPanelPositions(JSON.parse(savedPositions));
    }
  }, []);

  // Initialize keybind settings
  useEffect(() => {
    const initializeKeybinds = async () => {
      try {
        const response = await fetch("./jsonFiles/Tiles.json");
        const data = await response.json();

        // Build default keybinds from tiles data
        const defaultKeybinds = {};
        data.Tiles?.forEach((tile) => {
          if (tile.keybind) {
            defaultKeybinds[tile.keybind] = {
              type: tile.type,
              name: tile.name,
            };
          }
        });

        // Add default erase keybind
        defaultKeybinds["Backspace"] = {
          type: "special",
          name: "Erase",
        };

        // Load saved keybinds or use defaults
        const savedKeybinds = localStorage.getItem(
          "civ6-helper-hex-planner-keybinds"
        );
        const finalKeybinds = savedKeybinds
          ? { ...defaultKeybinds, ...JSON.parse(savedKeybinds) }
          : defaultKeybinds;

        setKeybindSettings(finalKeybinds);
      } catch (error) {
        console.error("Failed to load keybind settings:", error);
      }
    };

    if (Object.keys(keybindSettings).length === 0) {
      initializeKeybinds();
    }
  }, [keybindSettings]);

  // Save keybind settings to localStorage when they change
  useEffect(() => {
    if (Object.keys(keybindSettings).length > 0) {
      localStorage.setItem(
        "civ6-helper-hex-planner-keybinds",
        JSON.stringify(keybindSettings)
      );
    }
  }, [keybindSettings]);

  // Handle drag end to persist panel positions
  const handleDragEnd = (event) => {
    const { active, delta } = event;

    if (delta.x !== 0 || delta.y !== 0) {
      setPanelPositions((prev) => {
        // Get current position or use default
        const currentPosition = prev[active.id] || { x: 20, y: 20 };

        const newPositions = {
          ...prev,
          [active.id]: {
            x: currentPosition.x + delta.x,
            y: currentPosition.y + delta.y,
          },
        };

        // Save to localStorage
        localStorage.setItem(
          "civ6-helper-hex-planner-panel-positions",
          JSON.stringify(newPositions)
        );

        return newPositions;
      });
    }
  };

  // Handle keyboard shortcuts for quick tile selection
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle if the hex planner container is focused/visible and not in an input
      if (event.target.tagName === "INPUT" || event.target.tagName === "SELECT")
        return;

      const key =
        event.key === "Backspace" ? "Backspace" : event.key.toLowerCase();
      const keybind = keybindSettings[key];

      if (keybind) {
        event.preventDefault();

        // Handle erase functionality
        if (keybind.type === "special" && keybind.name === "Erase") {
          setSelectedFillType("erase");
          setSelectedFillItem("Erase");
          return;
        }

        // Set the fill type and item based on the keybind
        if (keybind.type === "terrain") {
          setSelectedFillType("terrain");
          setSelectedFillItem(keybind.name);
        } else if (keybind.type === "district") {
          setSelectedFillType("district");
          setSelectedFillItem(keybind.name);
        } else if (keybind.type === "special" && keybind.name === "River") {
          setSelectedFillType("river");
          setSelectedFillItem("River");
        } else if (keybind.type === "Tile Improvement") {
          setSelectedFillType("improvement");
          setSelectedFillItem(keybind.name);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [keybindSettings]);

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

    // Handle erase mode - clear all tile data
    if (selectedFillType === "erase") {
      newTileData.terrain = null;
      newTileData.features = [];
      newTileData.feature = null;
      newTileData.district = null;
      newTileData.wonder = null;
      newTileData.naturalWonder = null;
      newTileData.tileImprovement = null;
      newTileData.hasRiverEdges = {
        top: false,
        topRight: false,
        bottomRight: false,
        bottom: false,
        bottomLeft: false,
        topLeft: false,
      };
      handleTileSelect(hexId, newTileData);
      return;
    }

    if (clickType === "right") {
      // Right-click: clear the selected type
      if (selectedFillType === "terrain") {
        newTileData.terrain = null;
      } else if (selectedFillType === "feature") {
        // Remove specific feature from features array or clear legacy feature
        if (newTileData.features && newTileData.features.length > 0) {
          newTileData.features = newTileData.features.filter(
            (f) => f !== selectedFillItem
          );
        }
        if (newTileData.feature === selectedFillItem) {
          newTileData.feature = null;
        }
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

        // Initialize features array if not exists
        if (!newTileData.features) {
          newTileData.features = [];
        }

        // Add feature to array if not already present
        if (!newTileData.features.includes(selectedFillItem)) {
          newTileData.features.push(selectedFillItem);
        }

        // Keep legacy feature field for backward compatibility (use first feature)
        newTileData.feature = newTileData.features[0] || null;
      } else if (selectedFillType === "district") {
        // Clear conflicting items when placing districts
        newTileData.features = [];
        newTileData.feature = null;
        newTileData.wonder = null;
        newTileData.naturalWonder = null;
        newTileData.district = selectedFillItem;
      } else if (selectedFillType === "wonder") {
        // Clear conflicting items when placing wonders
        newTileData.features = [];
        newTileData.feature = null;
        newTileData.district = null;
        newTileData.naturalWonder = null;
        newTileData.wonder = selectedFillItem;
      } else if (selectedFillType === "naturalWonder") {
        // Clear conflicting items when placing natural wonders
        newTileData.features = [];
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
    // Clamp radius to allowed range [1, 15]
    const clamped = Math.max(1, Math.min(15, Number(newRadius) || 1));
    setGridRadius(clamped);
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
          <DndContext
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
          >
            <div
              className="relative overflow-hidden"
              style={{ minHeight: "600px" }}
            >
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

              {/* Tile Configuration Tool - Overlay positioned at top */}
              <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
                <div className="pointer-events-auto">
                  <TileConfigurationTool
                    selectedFillType={selectedFillType}
                    selectedFillItem={selectedFillItem}
                    onFillTypeChange={setSelectedFillType}
                    onFillItemChange={setSelectedFillItem}
                  />
                </div>
              </div>

              {/* Status and Controls - Overlay positioned at bottom */}

              <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                <div className="flex items-center justify-between pointer-events-auto">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-sm text-gray-600">
                      {selectedFillItem
                        ? selectedFillType === "river"
                          ? "Click on hex edges to add/remove rivers. Right-click edges to remove."
                          : selectedFillType === "erase"
                          ? "Click hexes to erase all data from tiles. Use keyboard shortcuts for quick selection."
                          : `Click hexes to apply ${selectedFillItem}. Right-click to clear ${selectedFillType}. Use keyboard shortcuts for quick selection.`
                        : "Select a tile type and item above to start configuring hexes."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                    <button
                      onClick={handleResetView}
                      className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Reset View
                    </button>

                    <label className="text-sm font-medium text-gray-700 mr-2">
                      Grid Radius:
                    </label>

                    <input
                      type="number"
                      min={1}
                      max={15}
                      step={1}
                      value={gridRadius}
                      onChange={(e) =>
                        handleRadiusChange(parseInt(e.target.value))
                      }
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Grid radius (1-15)"
                    />
                  </div>
                </div>
              </div>

              {/* Draggable Panels */}
              <AdjacencyLegend
                isVisible={showLegend}
                onClose={() => setShowLegend(false)}
                selectedFillType={selectedFillType}
                selectedFillItem={selectedFillItem}
                position={
                  panelPositions["adjacency-legend"] || { x: 20, y: 20 }
                }
              />
              <TerrainLegend
                isVisible={showTerrainLegend}
                onClose={() => setShowTerrainLegend(false)}
                position={panelPositions["terrain-legend"] || { x: 20, y: 60 }}
              />
              <AdjacencySettings
                isVisible={showAdjacencySettings}
                onClose={() => setShowAdjacencySettings(false)}
                settings={settings}
                onSettingsChange={setAdjacencySettings}
                position={
                  panelPositions["adjacency-settings"] || { x: 20, y: 100 }
                }
              />
              <CityStateSuzerainSettings
                isVisible={showCityStateSettings}
                onClose={() => setShowCityStateSettings(false)}
                onSettingsChange={setCityStateSettings}
                position={
                  panelPositions["citystate-settings"] || { x: 20, y: 140 }
                }
              />
              <KeybindSettings
                isVisible={showKeybindSettings}
                onClose={() => setShowKeybindSettings(false)}
                keybindSettings={keybindSettings}
                onKeybindSettingsChange={setKeybindSettings}
                position={
                  panelPositions["keybind-settings"] || { x: 20, y: 180 }
                }
              />
            </div>
          </DndContext>

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
            {!showKeybindSettings && (
              <button
                onClick={() => setShowKeybindSettings(true)}
                className="text-xs text-yellow-600 hover:text-yellow-800 underline"
              >
                Show Keybind Settings
              </button>
            )}
          </div>
        </div>
      </CollapsibleContainer>
    </>
  );
};

export default HexPlannerContainer;
