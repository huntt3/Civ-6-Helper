/**
 * Utility functions to manage page-specific localStorage and default states
 */

/**
 * Get the current page identifier based on the current URL or script source
 * @returns {string} Page identifier (e.g., 'index', 'eraScoreTracker', etc.)
 */
export const getCurrentPageId = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return "index";
  }

  // Get the current HTML file name from the URL
  const pathname = window.location.pathname;
  const htmlFile = pathname.split("/").pop();

  // Map HTML files to page IDs
  const pageMapping = {
    "index.html": "index",
    "eraScoreTracker.html": "eraScoreTracker",
    "wonderTracker.html": "wonderTracker",
    "districtDiscountingTool.html": "districtDiscountingTool",
    "greatPeopleTracker.html": "greatPeopleTracker",
    "hexPlanner.html": "hexPlanner",
    "techsAndCivicsTree.html": "techsAndCivicsTree",
    "": "index", // Default to index for empty or root paths
  };

  return pageMapping[htmlFile] || "index";
};

/**
 * Generate a page-specific localStorage key
 * @param {string} baseKey - The base key name
 * @returns {string} Page-specific localStorage key
 */
export const getPageSpecificKey = (baseKey) => {
  const pageId = getCurrentPageId();
  return `${baseKey}-${pageId}`;
};

/**
 * Get the default collapsed state for collapsible containers
 * @returns {boolean} Default collapsed state (true for index, false for others)
 */
export const getDefaultCollapsedState = () => {
  const pageId = getCurrentPageId();
  return pageId === "index"; // Only index page starts collapsed
};

/**
 * Load page-specific state from localStorage with fallback to default
 * @param {string} baseKey - The base localStorage key
 * @param {*} defaultValue - Default value if no saved state exists
 * @returns {*} Saved state or default value
 */
export const loadPageSpecificState = (baseKey, defaultValue) => {
  const pageSpecificKey = getPageSpecificKey(baseKey);

  try {
    const saved = localStorage.getItem(pageSpecificKey);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn(
      `Error parsing localStorage for key ${pageSpecificKey}:`,
      error
    );
  }

  return defaultValue;
};

/**
 * Save page-specific state to localStorage
 * @param {string} baseKey - The base localStorage key
 * @param {*} value - Value to save
 */
export const savePageSpecificState = (baseKey, value) => {
  const pageSpecificKey = getPageSpecificKey(baseKey);

  try {
    localStorage.setItem(pageSpecificKey, JSON.stringify(value));
  } catch (error) {
    console.warn(
      `Error saving to localStorage for key ${pageSpecificKey}:`,
      error
    );
  }
};

/**
 * Remove page-specific state from localStorage
 * @param {string} baseKey - The base localStorage key
 */
export const removePageSpecificState = (baseKey) => {
  const pageSpecificKey = getPageSpecificKey(baseKey);

  try {
    localStorage.removeItem(pageSpecificKey);
  } catch (error) {
    console.warn(
      `Error removing from localStorage for key ${pageSpecificKey}:`,
      error
    );
  }
};
