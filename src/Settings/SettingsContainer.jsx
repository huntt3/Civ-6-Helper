import React, { useState } from "react";
import "./Settings.css";
import EraDropdown from "./EraDropdown";
import VersionDropdown from "./VersionDropdown";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import Checkbox from "../Templates/Checkbox";

// TechTreeContainer manages the collapsed state for the CollapsibleContainer
const SettingsContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);

  // Function to handle collapsing/expanding the container
  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const [heroesLegends, setHeroesLegends] = useState(false);
  const [monopoliesCorporations, setMonopoliesCorporations] = useState(false);
  const [removeLimitations, setRemoveLimitations] = useState(false);

  return (
    <CollapsibleContainer
      title="Settings"
      collapsed={collapsed}
      onCollapse={handleCollapse}
      ariaLabel="Settings"
    >
      <div className="flex justify-center items-center">
        <EraDropdown />
        <VersionDropdown />
      </div>
      <div className="flex flex-col items-start space-y-2">
        <Checkbox
          label="Heroes & Legends"
          checked={heroesLegends}
          onChange={() => setHeroesLegends(!heroesLegends)}
        />
        <Checkbox
          label="Monopolies and Corporations"
          checked={monopoliesCorporations}
          onChange={() => setMonopoliesCorporations(!monopoliesCorporations)}
        />
        <Checkbox
          label="Remove All Limitations"
          checked={removeLimitations}
          onChange={() => setRemoveLimitations(!removeLimitations)}
        />
      </div>
    </CollapsibleContainer>
  );
};

export default SettingsContainer;
