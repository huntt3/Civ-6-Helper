/**
 * Hex Planner tile data structure and validation utilities
 */

// Terrain types that every tile must have
export const TERRAIN_TYPES = [
  "Grassland",
  "Plains",
  "Desert",
  "Tundra",
  "Snow",
  "Coast",
  "Ocean",
];

// Feature types (optional, mutually exclusive with districts/wonders)
export const FEATURE_TYPES = [
  "Woods",
  "Rainforest",
  "Marsh",
  "Floodplains",
  "Hills",
  "Ice",
  "Reef",
  "Volcanic Soil",
  "Geothermal Fissure",
];

// District types (mutually exclusive with features, wonders, and each other)
export const DISTRICT_TYPES = [
  "City Center",
  "Campus",
  "Theater Square",
  "Holy Site",
  "Encampment",
  "Commercial Hub",
  "Harbor",
  "Industrial Zone",
  "Preserve",
  "Entertainment Complex",
  "Water Park",
  "Aerodrome",
  "Spaceport",
  "Government Plaza",
  "Diplomatic Quarter",
  "Aqueduct",
  "Canal",
  "Dam",
  "Neighborhood",
];

// Wonder types (mutually exclusive with features, districts, and each other)
export const WONDER_TYPES = [
  "Wonder", // Generic wonder placeholder
];

// Natural Wonder types (special placement rules)
export const NATURAL_WONDER_TYPES = [
  "Natural Wonder", // Generic natural wonder placeholder
];

// Tile Improvement types (can be placed on terrain/features if requirements met)
export const TILE_IMPROVEMENT_TYPES = [
  "Farm",
  "Mine",
  "Quarry",
  "Plantation",
  "Camp",
  "Pasture",
  "Fishing Boat",
  "Lumber Mill",
  "Fort",
  "Airstrip",
  "Seaside Resort",
  "Geothermal Plant",
  "Wind Farm",
  "Solar Farm",
  "Offshore Wind Farm",
  "Ski Resort",
  "Oil Well",
  "Offshore Oil Rig",
  "Missile Silo",
  "Mountain Tunnel",
  "Seastead",
];

/**
 * Validate if a tile configuration is valid
 * @param {Object} tileData - The tile data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateTileConfiguration = (tileData) => {
  const errors = [];

  // Every tile must have terrain
  if (!tileData.terrain) {
    errors.push("Every tile must have a terrain type");
  }

  // Features are mutually exclusive with districts and wonders
  if (tileData.feature && (tileData.district || tileData.wonder)) {
    errors.push(
      "Features cannot be placed on the same tile as districts or wonders"
    );
  }

  // Districts and wonders are mutually exclusive
  if (tileData.district && tileData.wonder) {
    errors.push("Districts and wonders cannot be placed on the same tile");
  }

  // Tile improvements can coexist with terrain and features, but not with districts/wonders
  if (tileData.tileImprovement && (tileData.district || tileData.wonder)) {
    errors.push(
      "Tile improvements cannot be placed on tiles with districts or wonders"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get the default tile structure
 * @returns {Object} Default tile data structure
 */
export const getDefaultTile = () => ({
  terrain: null,
  feature: null,
  district: null,
  wonder: null,
  naturalWonder: null,
  tileImprovement: null,
  hasRiverEdges: {
    northeast: false,
    east: false,
    southeast: false,
    southwest: false,
    west: false,
    northwest: false,
  },
});

/**
 * Get tile categories for the modal
 * @returns {Array} Array of tile categories with their items
 */
export const getTileCategories = () => [
  {
    name: "Terrain",
    key: "terrain",
    items: TERRAIN_TYPES,
    required: true,
    description: "Base terrain type (required)",
  },
  {
    name: "Features",
    key: "feature",
    items: FEATURE_TYPES,
    required: false,
    description: "Natural features (optional)",
  },
  {
    name: "Districts",
    key: "district",
    items: DISTRICT_TYPES,
    required: false,
    description: "City districts",
  },
  {
    name: "Wonders",
    key: "wonder",
    items: WONDER_TYPES,
    required: false,
    description: "World wonders",
  },
  {
    name: "Natural Wonders",
    key: "naturalWonder",
    items: NATURAL_WONDER_TYPES,
    required: false,
    description: "Natural wonders",
  },
  {
    name: "Tile Improvements",
    key: "tileImprovement",
    items: TILE_IMPROVEMENT_TYPES,
    required: false,
    description: "Tile improvements",
  },
];

/**
 * Get display information for a tile (backward compatibility with old grid)
 * @param {Object} tileData - The new tile data structure
 * @returns {Object} Display info with name and type for rendering
 */
export const getTileDisplayInfo = (tileData) => {
  if (!tileData) return null;

  // Determine the primary display element (district > wonder > feature > terrain)
  if (tileData.district) {
    return { name: tileData.district, type: "district" };
  }
  if (tileData.wonder) {
    return { name: tileData.wonder, type: "wonder" };
  }
  if (tileData.naturalWonder) {
    return { name: tileData.naturalWonder, type: "natural-wonder" };
  }
  if (tileData.feature) {
    return { name: tileData.feature, type: "feature" };
  }
  if (tileData.terrain) {
    return { name: tileData.terrain, type: "terrain" };
  }

  return null;
};

/**
 * Check if a tile has actual content (not just river edges)
 * @param {Object} tileData - The tile data to check
 * @returns {boolean} Whether the tile has meaningful content
 */
export const tileHasActualContent = (tileData) => {
  if (!tileData) return false;
  return Boolean(
    tileData.terrain ||
      tileData.feature ||
      tileData.district ||
      tileData.wonder ||
      tileData.naturalWonder ||
      tileData.tileImprovement
  );
};

/**
 * Check if a tile has a specific type of content
 * @param {Object} tileData - The tile data to check
 * @param {string} contentType - The type to check for ('district', 'wonder', etc.)
 * @returns {boolean} Whether the tile has that content type
 */
export const tileHasContent = (tileData, contentType) => {
  if (!tileData) return false;
  return Boolean(tileData[contentType]);
};

/**
 * Get the opposite river edge direction
 * @param {string} edge - The river edge direction
 * @returns {string} The opposite edge direction
 */
export const getOppositeRiverEdge = (edge) => {
  const opposites = {
    northeast: "southwest",
    east: "west",
    southeast: "northwest",
    southwest: "northeast",
    west: "east",
    northwest: "southeast",
  };
  return opposites[edge];
};

/**
 * Get adjacent hex coordinates with their shared edge
 * @param {Object} hex - The hex object with q, r coordinates
 * @returns {Array} Array of adjacent hex info with coordinates and shared edge
 */
export const getAdjacentHexInfo = (hex) => {
  const directions = [
    { q: 0, r: -1, edge: "northwest", oppositeEdge: "southeast" },
    { q: 1, r: -1, edge: "northeast", oppositeEdge: "southwest" },
    { q: 1, r: 0, edge: "east", oppositeEdge: "west" },
    { q: 0, r: 1, edge: "southeast", oppositeEdge: "northwest" },
    { q: -1, r: 1, edge: "southwest", oppositeEdge: "northeast" },
    { q: -1, r: 0, edge: "west", oppositeEdge: "east" },
  ];

  return directions.map((dir) => ({
    q: hex.q + dir.q,
    r: hex.r + dir.r,
    id: `${hex.q + dir.q},${hex.r + dir.r}`,
    sharedEdge: dir.edge,
    adjacentEdge: dir.oppositeEdge,
  }));
};

/**
 * Update river edges ensuring they're shared between adjacent hexes
 * @param {Array} hexagons - Current hexagons array
 * @param {string} hexId - ID of hex being updated
 * @param {Object} newTileData - New tile data with river edges
 * @returns {Array} Updated hexagons array with synchronized river edges
 */
export const updateRiverEdges = (hexagons, hexId, newTileData) => {
  const updatedHexagons = [...hexagons];

  // Find the hex being updated
  const hexIndex = updatedHexagons.findIndex((h) => h.id === hexId);
  if (hexIndex === -1) return hexagons;

  const currentHex = updatedHexagons[hexIndex];

  // Update the current hex
  updatedHexagons[hexIndex] = {
    ...currentHex,
    tile: newTileData,
  };

  // Get adjacent hex information
  const adjacentHexInfo = getAdjacentHexInfo(currentHex);

  // Update adjacent hexes to synchronize river edges
  adjacentHexInfo.forEach((adjInfo) => {
    const adjHexIndex = updatedHexagons.findIndex((h) => h.id === adjInfo.id);
    if (adjHexIndex === -1) return;

    const adjHex = updatedHexagons[adjHexIndex];

    // If the adjacent hex doesn't have tile data, create default structure
    if (!adjHex.tile) {
      adjHex.tile = getDefaultTile();
    }

    // Synchronize the shared river edge
    const currentHexHasRiver = newTileData.hasRiverEdges?.[adjInfo.sharedEdge];

    updatedHexagons[adjHexIndex] = {
      ...adjHex,
      tile: {
        ...adjHex.tile,
        hasRiverEdges: {
          ...adjHex.tile.hasRiverEdges,
          [adjInfo.adjacentEdge]: currentHexHasRiver || false,
        },
      },
    };
  });

  return updatedHexagons;
};
