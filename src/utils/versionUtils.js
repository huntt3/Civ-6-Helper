// Utility functions for handling version-specific properties

/**
 * Gets the appropriate property value based on version setting
 * @param {Object} item - The data item (wonder, great person, tech, etc.)
 * @param {string} property - The base property name (e.g., "ability", "requirement", etc.)
 * @param {string} version - The current version setting
 * @returns {any} - The property value to use
 */
export const getVersionProperty = (item, property, version) => {
  if (!item) return undefined;

  const isBBG = version === "Better Balanced Game Mod";
  const bbgProperty = `bbg${
    property.charAt(0).toUpperCase() + property.slice(1)
  }`;

  // If BBG version and BBG-specific property exists, use it
  if (isBBG && item[bbgProperty] !== undefined) {
    return item[bbgProperty];
  }

  // Otherwise, use the default property
  return item[property];
};

/**
 * Maps an item's properties based on version
 * @param {Object} item - The data item
 * @param {string} version - The current version setting
 * @returns {Object} - The item with version-appropriate properties
 */
export const mapVersionProperties = (item, version) => {
  if (!item) return item;

  // Properties to check for version-specific variants
  const propertiesToMap = [
    "ability",
    "charges",
    "requirement",
    "prerequisites",
    "boostPrerequisites",
  ];

  const mappedItem = { ...item };

  propertiesToMap.forEach((property) => {
    const value = getVersionProperty(item, property, version);
    if (value !== undefined) {
      mappedItem[property] = value;
    }
  });

  return mappedItem;
};

/**
 * Maps an array of items based on version
 * @param {Array} items - Array of data items
 * @param {string} version - The current version setting
 * @returns {Array} - Array of items with version-appropriate properties
 */
export const mapVersionPropertiesArray = (items, version) => {
  if (!Array.isArray(items)) return items;

  return items.map((item) => mapVersionProperties(item, version));
};
