import React, { useState } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";

// This component manages the collapsed state for the CollapsibleContainer
const DistrictPlannerContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);

  // Function to handle collapsing/expanding the container
  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  return (
    <CollapsibleContainer
      title="District Planner"
      collapsed={collapsed}
      onCollapse={handleCollapse}
      ariaLabel="District Planner"
    ></CollapsibleContainer>
  );
};

export default DistrictPlannerContainer;
