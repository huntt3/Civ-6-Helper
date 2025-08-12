import React, { useState, useRef } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import DistrictPlannerHexGrid from "./HexPlannerHexGrid";
import DistrictPlannerModal from "./HexPlannerModal";

// This component manages the collapsed state for the CollapsibleContainer
const DistrictPlannerContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHex, setSelectedHex] = useState(null);
  const [gridRadius, setGridRadius] = useState(3);

  // Reference to the hex grid component
  const hexGridRef = useRef(null);

  // Function to handle collapsing/expanding the container
  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  // Function to handle hex click
  const handleHexClick = (hexId, coords) => {
    setSelectedHex({ id: hexId, coords });
    setModalOpen(true);
  };

  // Function to handle tile selection
  const handleTileSelect = (hexId, tileData) => {
    if (hexGridRef.current && hexGridRef.current.updateHexTile) {
      hexGridRef.current.updateHexTile(hexId, tileData);
    }
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedHex(null);
  };

  // Function to handle radius change
  const handleRadiusChange = (newRadius) => {
    setGridRadius(newRadius);
  };

  return (
    <>
      <CollapsibleContainer
        title="District Planner"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        ariaLabel="District Planner"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Click on any hex to place a district, improvement, or feature. Use
              this to plan your city layout and optimize adjacency bonuses.
            </p>
            <div className="flex items-center gap-2 ml-4">
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
              </select>
            </div>
          </div>
          <DistrictPlannerHexGrid
            ref={hexGridRef}
            onHexClick={handleHexClick}
            radius={gridRadius}
          />
        </div>
      </CollapsibleContainer>

      <DistrictPlannerModal
        open={modalOpen}
        onClose={handleModalClose}
        onTileSelect={handleTileSelect}
        selectedHex={selectedHex}
      />
    </>
  );
};

export default DistrictPlannerContainer;
