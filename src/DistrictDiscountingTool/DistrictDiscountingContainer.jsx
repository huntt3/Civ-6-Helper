import React, { useState, useEffect } from "react";
import DistrictCards from "./DistrictCards";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import DistrictDiscountingFormulaInputs from "./DistrictDiscountingFormulaInputs.jsx";
import ManualInputDistrictInfo from "./ManualInputDistrictInfo";
import DistrictDiscountingExplanation from "./DistrictDiscountingExplanation";
import TechsAndCivicsPercentage from "./TechsAndCivicsPercentage";
import {
  loadPageSpecificState,
  savePageSpecificState,
  getDefaultCollapsedState,
  removePageSpecificState,
} from "../utils/pageContext";

// This component manages the collapsed state for the CollapsibleContainer
const DistrictDiscountingContainer = () => {
  // State to track if the container is collapsed with localStorage
  const [collapsed, setCollapsed] = useState(() =>
    loadPageSpecificState(
      "civ6-helper-district-collapsed",
      getDefaultCollapsedState()
    )
  );
  // Base keys for localStorage (will be made page-specific)
  const LS_TECHS = "districtDiscounting_techsCompleted";
  const LS_CIVICS = "districtDiscounting_civicsCompleted";
  const LS_RESEARCHED = "districtDiscounting_researchedStates";
  const LS_BUILT = "districtDiscounting_numberBuiltStates";

  const numDistricts = 14;

  // Load from localStorage or default (page-specific)
  const [techsCompleted, setTechsCompleted] = useState(() =>
    loadPageSpecificState(LS_TECHS, 0)
  );
  const [civicsCompleted, setCivicsCompleted] = useState(() =>
    loadPageSpecificState(LS_CIVICS, 0)
  );
  const [researchedStates, setResearchedStates] = useState(() =>
    loadPageSpecificState(LS_RESEARCHED, Array(numDistricts).fill(false))
  );
  const [numberBuiltStates, setNumberBuiltStates] = useState(() =>
    loadPageSpecificState(LS_BUILT, Array(numDistricts).fill(0))
  );

  // Persist to page-specific localStorage on change
  useEffect(() => {
    savePageSpecificState(LS_TECHS, techsCompleted);
  }, [techsCompleted]);
  useEffect(() => {
    savePageSpecificState(LS_CIVICS, civicsCompleted);
  }, [civicsCompleted]);
  useEffect(() => {
    savePageSpecificState(LS_RESEARCHED, researchedStates);
  }, [researchedStates]);
  useEffect(() => {
    savePageSpecificState(LS_BUILT, numberBuiltStates);
  }, [numberBuiltStates]);

  // Save collapsed state to localStorage
  useEffect(() => {
    savePageSpecificState("civ6-helper-district-collapsed", collapsed);
  }, [collapsed]);

  // Reset all inputs and localStorage
  const handleReset = () => {
    removePageSpecificState(LS_TECHS);
    removePageSpecificState(LS_CIVICS);
    removePageSpecificState(LS_RESEARCHED);
    removePageSpecificState(LS_BUILT);
    // Do NOT remove civ6-helper-district-collapsed
    setTechsCompleted(0);
    setCivicsCompleted(0);
    setResearchedStates(Array(numDistricts).fill(false));
    setNumberBuiltStates(Array(numDistricts).fill(0));
    // Preserve collapsed state
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
      title="District Discount Tracker"
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
        <DistrictDiscountingFormulaInputs
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
