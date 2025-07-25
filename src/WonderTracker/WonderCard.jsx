import React, { useEffect, useState } from "react";

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
    // Also listen for focus events to update immediately when user returns to tab
    window.addEventListener("focus", checkResearched);
    // Also poll every 500ms for changes (for immediate UI update)
    const interval = setInterval(checkResearched, 500);
    return () => {
      window.removeEventListener("storage", checkResearched);
      window.removeEventListener(
        "civ6_tech_civic_state_changed",
        checkResearched
      );
      window.removeEventListener("focus", checkResearched);
      clearInterval(interval);
    };
  }, [wonder.requirement]);

  // Add 'built' class if wonder.built is true, and 'available' if requirement is researched
  const cardClass = `wonder-card${wonder.built ? " built" : ""}${
    isAvailable ? " available" : ""
  }`;
  let cardStyle = {
    background: wonder.built
      ? "var(--secondary-container-color)"
      : isAvailable
      ? "var(--wonder-card-available-color)"
      : "var(--primary-bg-color)",
    color: wonder.built
      ? "var(--secondary-text-color-dark)"
      : "var(--primary-text-color-dark)",
    border: "1px solid var(--primary-border-color)",
  };
  return (
    <div
      className={`rounded-lg shadow-md px-8 py-4 min-w-[180px] text-center text-lg cursor-pointer transition-colors transition-shadow outline-none focus:ring-2 focus:ring-yellow-400 hover:bg-gray-100 mb-2`}
      tabIndex={0}
      role="button"
      aria-pressed={wonder.built}
      onClick={onClick}
      aria-label={wonder.name}
      style={cardStyle}
    >
      <h3 className="font-semibold text-xl mb-2">{wonder.name}</h3>
      <p className="text-base">{wonder.description}</p>
    </div>
  );
};

export default WonderCard;
