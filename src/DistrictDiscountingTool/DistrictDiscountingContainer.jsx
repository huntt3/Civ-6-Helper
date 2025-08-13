import React, { useState } from "react";
import DistrictCards from "./DistrictCards";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import ManualInputDistrictInfo from "./ManualInputDistrictInfo";
import DistrictDiscountingExplanation from "./DistrictDiscountingExplanation";
import TechsAndCivicsPercentage from "./TechsAndCivicsPercentage";

// This component manages the collapsed state for the CollapsibleContainer
const DistrictDiscountingContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);
  const [techsCompleted, setTechsCompleted] = useState(0);
  const [civicsCompleted, setCivicsCompleted] = useState(0);
  const numDistricts = 14;
  const [researchedStates, setResearchedStates] = useState(
    Array(numDistricts).fill(false)
  );
  const [numberBuiltStates, setNumberBuiltStates] = useState(
    Array(numDistricts).fill(0)
  );
  const numSpecialtyDistrictsCompleted = numberBuiltStates.reduce(
    (a, b) => a + b,
    0
  );
  const numSpecialtyDistrictsUnlocked = researchedStates.filter(Boolean).length;

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
        <DistrictDiscountingExplanation
          numSpecialtyDistrictsCompleted={numSpecialtyDistrictsCompleted}
          numSpecialtyDistrictsUnlocked={numSpecialtyDistrictsUnlocked}
        />
      </div>
      <div className="flex justify-center w-full">
        <ManualInputDistrictInfo
          techsCompleted={techsCompleted}
          setTechsCompleted={setTechsCompleted}
          civicsCompleted={civicsCompleted}
          setCivicsCompleted={setCivicsCompleted}
        />
      </div>
      <div className="flex justify-center w-full">
        <TechsAndCivicsPercentage
          techsCompleted={techsCompleted}
          setTechsCompleted={setTechsCompleted}
          civicsCompleted={civicsCompleted}
          setCivicsCompleted={setCivicsCompleted}
        />
      </div>
      <DistrictCards
        techsCompleted={techsCompleted}
        civicsCompleted={civicsCompleted}
        researchedStates={researchedStates}
        setResearchedStates={setResearchedStates}
        numberBuiltStates={numberBuiltStates}
        setNumberBuiltStates={setNumberBuiltStates}
        numSpecialtyDistrictsCompleted={numSpecialtyDistrictsCompleted}
        numSpecialtyDistrictsUnlocked={numSpecialtyDistrictsUnlocked}
      />
    </CollapsibleContainer>
  );
};

export default DistrictDiscountingContainer;
