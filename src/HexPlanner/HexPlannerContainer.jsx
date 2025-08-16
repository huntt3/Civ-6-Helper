import React, { useState, useRef } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import CustomHexGrid from "./CustomHexGrid";
import HexPlannerModal from "./HexPlannerModal";

const HexPlannerContainer = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHex, setSelectedHex] = useState(null);
  const [gridRadius, setGridRadius] = useState(3);

  const hexGridRef = useRef(null);

  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const handleHexClick = (hexId, coords) => {
    setSelectedHex({ id: hexId, coords });
    setModalOpen(true);
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
    // Force re-render of hex grid by changing radius slightly and back
    setGridRadius((prev) => (prev === 3 ? 3.1 : 3));
    setTimeout(() => setGridRadius(3), 100);
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
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Click on any hex to place a district, improvement, or feature.
              Districts show their adjacency bonus in gold. Use scroll wheel to
              zoom, drag to pan.
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
          <CustomHexGrid
            ref={hexGridRef}
            onHexClick={handleHexClick}
            radius={gridRadius}
          />
          <div className="mt-4 text-xs text-gray-500">
            <p>
              <strong>Adjacency Bonus Legend:</strong>
            </p>
            <p>• Minor adjacencies (other districts): +0.5 points</p>
            <p>• Normal adjacencies (features/terrain): +1 point</p>
            <p>• Major adjacencies (special features): +2 points</p>
          </div>
        </div>
      </CollapsibleContainer>

      <HexPlannerModal
        open={modalOpen}
        onClose={handleModalClose}
        onTileSelect={handleTileSelect}
        selectedHex={selectedHex}
      />
    </>
  );
};

export default HexPlannerContainer;
