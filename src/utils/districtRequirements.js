/**
 * Utility functions to handle district research requirements
 */

// District requirements mapping based on Tiles.json
const DISTRICT_REQUIREMENTS = {
  Campus: "Writing",
  "Theater Square": "Drama and Poetry",
  "Holy Site": "Astrology",
  Encampment: "Bronze Working",
  "Commercial Hub": "Currency",
  Harbor: "Celestial Navigation",
  "Industrial Zone": "Apprenticeship",
  Preserve: "Mysticism",
  "Entertainment Complex": "Games and Recreation",
  "Water Park": "Natural History",
  Aerodrome: "Flight",
  Spaceport: "Rocketry",
  "Government Plaza": "State Workforce",
  "Diplomatic Quarter": "Mathematics",
};

/**
 * Get the tech/civic requirement for a district
 * @param {string} districtName - The name of the district
 * @returns {string|null} The required tech/civic name, or null if no requirement
 */
export const getDistrictRequirement = (districtName) => {
  return DISTRICT_REQUIREMENTS[districtName] || null;
};

/**
 * Check if a district is researched based on TechTree state
 * @param {string} districtName - The name of the district
 * @returns {boolean} Whether the district requirement is researched
 */
export const isDistrictResearched = (districtName) => {
  const requirement = getDistrictRequirement(districtName);

  if (!requirement) {
    return false; // No requirement means not available
  }

  try {
    const techState = localStorage.getItem("civ6_tech_state");
    if (!techState) {
      return false;
    }

    const parsedState = JSON.parse(techState);
    const reqState = parsedState[requirement];

    return reqState && reqState.researched === true;
  } catch (error) {
    console.warn("Error checking district research state:", error);
    return false;
  }
};

/**
 * Get all district research states based on TechTree
 * @returns {Object} Object with district names as keys and research status as values
 */
export const getAllDistrictResearchStates = () => {
  const states = {};

  Object.keys(DISTRICT_REQUIREMENTS).forEach((districtName) => {
    states[districtName] = isDistrictResearched(districtName);
  });

  return states;
};
