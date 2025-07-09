import React, { useEffect, useState } from "react";
import "./WonderTracker.css";

// WonderCard component
const WonderCard = ({ wonder, onClick }) => {
  // Check if the requirement is researched
  const [isAvailable, setIsAvailable] = useState(false);
  useEffect(() => {
    // Check for changes in localStorage for tech/civic state
    const checkResearched = () => {
      let researched = false;
      const techState = JSON.parse(
        localStorage.getItem("civ6_tech_state") || "{}"
      );
      const civicState = JSON.parse(
        localStorage.getItem("civ6_civics_state") || "{}"
      );
      if (techState[wonder.requirement]?.researched) researched = true;
      if (civicState[wonder.requirement]?.researched) researched = true;
      setIsAvailable(researched);
    };
    checkResearched();
    // Listen for storage changes (from other tabs/windows)
    window.addEventListener("storage", checkResearched);
    // Listen for custom event when tech/civic state changes in this tab
    window.addEventListener("civ6_tech_civic_state_changed", checkResearched);
    return () => {
      window.removeEventListener("storage", checkResearched);
      window.removeEventListener(
        "civ6_tech_civic_state_changed",
        checkResearched
      );
    };
  }, [wonder.requirement]);

  // Add 'built' class if wonder.built is true, and 'available' if requirement is researched
  const cardClass = `wonder-card${wonder.built ? " built" : ""}${
    isAvailable ? " available" : ""
  }`;
  return (
    <div
      className={cardClass}
      onClick={onClick}
      tabIndex={0}
      aria-label={`Show details for ${wonder.name}`}
    >
      <span className="wonder-card-title">{wonder.name}</span>
    </div>
  );
};

export default WonderCard;
