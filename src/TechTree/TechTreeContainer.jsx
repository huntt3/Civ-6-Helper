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
    <>
      <CollapsibleContainer
        title="Tech Tracker"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        ariaLabel="Tech Tracker"
      >
        <TechCarousel rowRange={{ start: 0, end: 7 }} minRow={0} />
      </CollapsibleContainer>
      <CollapsibleContainer
        title="Civic Tracker"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        ariaLabel="Civic Tracker"
      >
        <TechCarousel rowRange={{ start: 10, end: 16 }} minRow={10} />
      </CollapsibleContainer>
    </>
  );
};

export default TechTreeContainer;
