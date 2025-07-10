import React, { useState } from "react";
import "./Settings.css";
import EraDropdown from "./EraDropdown";
import VersionDropdown from "./VersionDropdown";
import CollapsibleContainer from "../Templates/CollapsibleContainer";

// TechTreeContainer manages the collapsed state for the CollapsibleContainer
const SettingsContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);

  // Function to handle collapsing/expanding the container
  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  return (
    <CollapsibleContainer
      title="Settings"
      collapsed={collapsed}
      onCollapse={handleCollapse}
      ariaLabel="Settings"
    >
      <div className="flex justify-center items-center p-4">
        <EraDropdown />
      </div>
      <div className="flex justify-center items-center p-4">
        <VersionDropdown />
      </div>
    </CollapsibleContainer>
  );
};

export default SettingsContainer;
