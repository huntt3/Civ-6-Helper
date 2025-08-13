import React, { useState, useEffect } from "react";
import DistrictCards from "./DistrictCards";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import ManualInputDistrictInfo from "./ManualInputDistrictInfo";
import DistrictDiscountingExplanation from "./DistrictDiscountingExplanation";
import TechsAndCivicsPercentage from "./TechsAndCivicsPercentage";

// This component manages the collapsed state for the CollapsibleContainer
const DistrictDiscountingContainer = () => {
  // State to track if the container is collapsed
  const [collapsed, setCollapsed] = useState(false);
  // Local storage keys
  const LS_TECHS = "districtDiscounting_techsCompleted";
  const LS_CIVICS = "districtDiscounting_civicsCompleted";
  const LS_RESEARCHED = "districtDiscounting_researchedStates";
  const LS_BUILT = "districtDiscounting_numberBuiltStates";

  const numDistricts = 14;

  // Load from localStorage or default
  const [techsCompleted, setTechsCompleted] = useState(() => {
    const val = localStorage.getItem(LS_TECHS);
    return val !== null ? Number(val) : 0;
  });
  const [civicsCompleted, setCivicsCompleted] = useState(() => {
    const val = localStorage.getItem(LS_CIVICS);
    return val !== null ? Number(val) : 0;
  });
  const [researchedStates, setResearchedStates] = useState(() => {
    const val = localStorage.getItem(LS_RESEARCHED);
    return val ? JSON.parse(val) : Array(numDistricts).fill(false);
  });
  const [numberBuiltStates, setNumberBuiltStates] = useState(() => {
    const val = localStorage.getItem(LS_BUILT);
    return val ? JSON.parse(val) : Array(numDistricts).fill(0);
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(LS_TECHS, techsCompleted);
  }, [techsCompleted]);
  useEffect(() => {
    localStorage.setItem(LS_CIVICS, civicsCompleted);
  }, [civicsCompleted]);
  useEffect(() => {
    localStorage.setItem(LS_RESEARCHED, JSON.stringify(researchedStates));
  }, [researchedStates]);
  useEffect(() => {
    localStorage.setItem(LS_BUILT, JSON.stringify(numberBuiltStates));
  }, [numberBuiltStates]);
  // Reset all inputs and localStorage
  const handleReset = () => {
    localStorage.removeItem(LS_TECHS);
    localStorage.removeItem(LS_CIVICS);
    localStorage.removeItem(LS_RESEARCHED);
    localStorage.removeItem(LS_BUILT);
    setTechsCompleted(0);
    setCivicsCompleted(0);
    setResearchedStates(Array(numDistricts).fill(false));
    setNumberBuiltStates(Array(numDistricts).fill(0));
  };
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
      onRefresh={handleReset}
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
          civicsCompleted={civicsCompleted}
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
