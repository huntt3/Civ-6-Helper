import React, { useState } from "react";
import DistrictCards from "./DistrictCards";
import CollapsibleContainer from "../Templates/CollapsibleContainer";

// This component manages the collapsed state for the CollapsibleContainer
const DistrictDiscountingContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);

  // Function to handle collapsing/expanding the container
  const handleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  return (
    <CollapsibleContainer
      title="District Discounting Tool"
      collapsed={collapsed}
      onCollapse={handleCollapse}
      ariaLabel="District Discounting Tool"
    >
      <DistrictCards />
    </CollapsibleContainer>
  );
};

export default DistrictDiscountingContainer;
