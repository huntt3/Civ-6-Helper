import React, { useState } from "react";
import TechCarousel from "./TechCarousel";
import CollapsibleContainer from "../Templates/CollapsibleContainer";

// TechTreeContainer manages the collapsed state for the CollapsibleContainer
const TechTreeContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  // Store reset handlers for each carousel using refs
  const techResetRef = React.useRef(null);
  const civicResetRef = React.useRef(null);

  // Callback to receive reset function from TechCarousel
  const setTechReset = (fn) => {
    techResetRef.current = fn;
  };
  const setCivicReset = (fn) => {
    civicResetRef.current = fn;
  };

  return (
    <>
      <CollapsibleContainer
        title="Tech Tracker"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        onRefresh={() => techResetRef.current && techResetRef.current()}
        ariaLabel="Tech Tracker"
      >
        <TechCarousel
          rowRange={{ start: 0, end: 7 }}
          minRow={0}
          onReset={setTechReset}
        />
      </CollapsibleContainer>
      <CollapsibleContainer
        title="Civic Tracker"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        onRefresh={() => civicResetRef.current && civicResetRef.current()}
        ariaLabel="Civic Tracker"
      >
        <TechCarousel
          rowRange={{ start: 10, end: 16 }}
          minRow={10}
          onReset={setCivicReset}
        />
      </CollapsibleContainer>
    </>
  );
};

export default TechTreeContainer;
