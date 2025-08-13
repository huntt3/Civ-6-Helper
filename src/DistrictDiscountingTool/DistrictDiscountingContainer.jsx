import React, { useState } from "react";
import DistrictCards from "./DistrictCards";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import ManualInputDistrictInfo from "./ManualInputDistrictInfo";
import DistrictDiscountingExplanation from "./DistrictDiscountingExplanation";

// This component manages the collapsed state for the CollapsibleContainer
const DistrictDiscountingContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);
  const [techsCompleted, setTechsCompleted] = useState(0);
  const [civicsCompleted, setCivicsCompleted] = useState(0);

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
      <div className="mb-6">
        <DistrictDiscountingExplanation />
      </div>
      <div className="flex justify-center w-full">
        <ManualInputDistrictInfo
          techsCompleted={techsCompleted}
          setTechsCompleted={setTechsCompleted}
          civicsCompleted={civicsCompleted}
          setCivicsCompleted={setCivicsCompleted}
        />
      </div>
      <DistrictCards
        techsCompleted={techsCompleted}
        civicsCompleted={civicsCompleted}
      />
    </CollapsibleContainer>
  );
};

export default DistrictDiscountingContainer;
