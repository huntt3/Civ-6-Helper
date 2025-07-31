import React, { useState, useRef } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import DistrictPlannerHexGrid from "./DistrictPlannerHexGrid";
import DistrictPlannerModal from "./DistrictPlannerModal";

// This component manages the collapsed state for the CollapsibleContainer
const DistrictPlannerContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHex, setSelectedHex] = useState(null);

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

  return (
    <>
      <CollapsibleContainer
        title="District Planner"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        ariaLabel="District Planner"
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Click on any hex to place a district, improvement, or feature. Use
            this to plan your city layout and optimize adjacency bonuses.
          </p>
          <DistrictPlannerHexGrid
            ref={hexGridRef}
            onHexClick={handleHexClick}
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
