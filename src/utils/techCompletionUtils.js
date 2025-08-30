/**
 * Utility functions to calculate tech and civic completion counts from TechTreeContainer state
 */

let cachedTechData = null;

/**
 * Get cached tech/civic data or fetch it if not available
 * @returns {Promise<Object>} Promise resolving to the TechsAndCivics data
 */
const getTechCivicData = async () => {
  if (cachedTechData) {
    return cachedTechData;
  }

  try {
    const response = await fetch("./jsonFiles/TechsAndCivics.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    cachedTechData = data;
    return data;
  } catch (error) {
    console.warn("Error fetching TechsAndCivics.json:", error);
    return { Techs: [] };
  }
};

/**
 * Enhanced version that uses the actual JSON data to determine tech vs civic
 * @returns {Promise<Object>} Promise resolving to object with techsCompleted and civicsCompleted counts
 */
export const calculateTechCivicCountsFromData = async () => {
  try {
    const saved = localStorage.getItem("civ6_tech_state");

    if (!saved) {
      return { techsCompleted: 0, civicsCompleted: 0 };
    }

    const techState = JSON.parse(saved);

    // Fetch the original data to properly categorize techs vs civics
    const data = await getTechCivicData();

    let techsCompleted = 0;
    let civicsCompleted = 0;

    // Create lookup maps from the data (all items are in the Techs array)
    const techNames = new Set();
    const civicNames = new Set();

    // Process all items from the Techs array, categorizing by techCivic property
    if (data.Techs) {
      data.Techs.forEach((item) => {
        if (item.techCivic === "Tech") {
          techNames.add(item.name);
        } else if (item.techCivic === "Civic") {
          civicNames.add(item.name);
        }
      });
    }

    // Count researched items based on their type
    Object.entries(techState).forEach(([name, state]) => {
      if (state.researched) {
        if (techNames.has(name)) {
          techsCompleted++;
        } else if (civicNames.has(name)) {
          civicsCompleted++;
        }
      }
    });

    return { techsCompleted, civicsCompleted };
  } catch (error) {
    console.warn("Error calculating tech/civic counts from data:", error);
    return { techsCompleted: 0, civicsCompleted: 0 };
  }
};

/**
 * Simpler synchronous version for immediate use (fallback)
 * @returns {Object} Object with techsCompleted and civicsCompleted counts
 */
export const calculateTechCivicCounts = () => {
  try {
    const saved = localStorage.getItem("civ6_tech_state");

    if (!saved) {
      return { techsCompleted: 0, civicsCompleted: 0 };
    }

    const techState = JSON.parse(saved);

    let techsCompleted = 0;
    let civicsCompleted = 0;

    // Use a simple heuristic based on known civic names
    const civicKeywords = [
      "Code of Laws",
      "Craftsmanship",
      "Foreign Trade",
      "State Workforce",
      "Early Empire",
      "Mysticism",
      "Drama and Poetry",
      "Military Tradition",
      "Political Philosophy",
      "Defensive Tactics",
      "Recorded History",
      "Theology",
      "Military Engineering",
      "Feudalism",
      "Civil Service",
      "Mercenaries",
      "Medieval Faires",
      "Guilds",
      "Divine Right",
      "Exploration",
      "Humanism",
      "Reformed Church",
      "Mercantilism",
      "The Enlightenment",
      "Colonialism",
      "Natural History",
      "Nationalism",
      "Opera and Ballet",
      "Scorched Earth",
      "Urbanization",
      "Conservation",
      "Mass Media",
      "Mobilization",
      "Capitalism",
      "Ideology",
      "Nuclear Program",
      "Suffrage",
      "Totalitarianism",
      "Class Struggle",
      "Cultural Heritage",
      "Cold War",
      "Professional Sports",
      "Rapid Deployment",
      "Space Race",
      "Globalization",
      "Social Media",
      "Near Future Governance",
      "Venture Politics",
      "Distributed Sovereignty",
      "Optimization Imperative",
      "Information Warfare",
      "Global Warming Mitigation",
      "Cultural Hegemony",
      "Smart Power Doctrine",
      "Exodus Imperative",
      "Future Civic",
    ];

    Object.entries(techState).forEach(([name, state]) => {
      if (state.researched) {
        if (civicKeywords.includes(name)) {
          civicsCompleted++;
        } else {
          techsCompleted++;
        }
      }
    });

    return { techsCompleted, civicsCompleted };
  } catch (error) {
    console.warn("Error calculating tech/civic counts:", error);
    return { techsCompleted: 0, civicsCompleted: 0 };
  }
};
