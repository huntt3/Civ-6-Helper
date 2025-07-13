import React, { useState } from "react";
import "./TechTree.css";
import TechCarousel from "./TechCarousel";
import CollapsibleContainer from "../Templates/CollapsibleContainer";

// TechTreeContainer manages the collapsed state for the CollapsibleContainer
const TechTreeContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  return (
    <CollapsibleContainer
      title="Tech and Civic Tracker"
      collapsed={collapsed}
      onCollapse={handleCollapse}
      ariaLabel="Tech and Civic Tracker"
    >
      <TechCarousel />
    </CollapsibleContainer>
  );
};

export default TechTreeContainer;
