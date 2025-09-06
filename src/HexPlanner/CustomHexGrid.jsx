import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  getTileDisplayInfo,
  tileHasContent,
  tileHasActualContent,
  updateRiverEdges,
} from "../utils/hexPlannerUtils";

const HEX_PLANNER_DATA_KEY = "civ6-helper-hex-planner-data";

const CustomHexGrid = forwardRef(
  (
    {
      onHexClick,
      radius = 3,
      selectedFillType,
      onEdgeClick,
      settings,
      adjacencySettings,
      cityStateSettings,
    },
    ref
  ) => {
    // Hexagon grid state (initialized on mount)
    const [hexagons, setHexagons] = useState([]);
    const [tiles, setTiles] = useState([]);
    const [adjacencySettingsData, setAdjacencySettingsData] = useState([]);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredHex, setHoveredHex] = useState(null);
    // Selected range state: { centerId, radius } or null
    const [selectedRange, setSelectedRange] = useState(null);
    const [hoveredEdge, setHoveredEdge] = useState(null);
    const svgRef = React.useRef(null);
    // Ref to skip saving on initial mount
    const isInitialMount = React.useRef(true);

    // Load tiles data on component mount
    React.useEffect(() => {
      fetch("./jsonFiles/Tiles.json")
        .then((res) => res.json())
        .then((data) => setTiles(data.Tiles || []))
        .catch(() => setTiles([]));
    }, []);

    // Load adjacency settings data on component mount
    React.useEffect(() => {
      fetch("./jsonFiles/AdjacencySettings.json")
        .then((res) => res.json())
        .then((data) => {
          // Flatten the grouped adjacency settings into a single array
          const settings = data.AdjacencySettings || {};
          const flattenedSettings = [];

          Object.entries(settings).forEach(([sectionName, settingsGroup]) => {
            if (Array.isArray(settingsGroup)) {
              settingsGroup.forEach((setting, index) => {
                flattenedSettings.push({
                  ...setting,
                  originalKey: `${sectionName}-${index}`, // Store original key for mapping
                });
              });
            }
          });

          setAdjacencySettingsData(flattenedSettings);
        })
        .catch(() => setAdjacencySettingsData([]));
    }, []);

    // Save hexagon data to localStorage whenever it changes (skip initial mount)
    React.useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      const hexDataToSave = hexagons
        .filter((hex) => hex.tile) // Save all hexes with any tile data
        .map((hex) => ({
          id: hex.id,
          q: hex.q,
          r: hex.r,
          s: hex.s,
          tile: hex.tile,
        }));

      console.log("Saving hex data to localStorage:", hexDataToSave); // Debug log

      if (hexDataToSave.length > 0) {
        localStorage.setItem(
          HEX_PLANNER_DATA_KEY,
          JSON.stringify(hexDataToSave)
        );
      }
      // Do not remove localStorage when no tiles; user should clear explicitly
    }, [hexagons]);

    // Load saved hex data from localStorage
    const loadSavedHexData = () => {
      try {
        const saved = localStorage.getItem(HEX_PLANNER_DATA_KEY);
        const data = saved ? JSON.parse(saved) : [];
        console.log("Loading saved hex data:", data); // Debug log
        return data;
      } catch (error) {
        console.error("Error loading saved hex data:", error);
        return [];
      }
    };

    // Helper function to convert tile name to camelCase filename
    const toCamelCase = (str) => {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
    };

    // Helper function to check if image exists
    const getImagePath = (tileData) => {
      if (!tileData) return null;

      // Get the primary display element for this tile
      const displayInfo = getTileDisplayInfo(tileData);
      if (!displayInfo) return null;

      const tileName = displayInfo.name;
      const camelCaseName = toCamelCase(tileName);

      const knownImages = [
        "cityCenter",
        "campus",
        "commercialHub",
        "harbor",
        "holySite",
        "industrialZone",
        "theaterSquare",
        "encampment",
        "aerodrome",
        "entertainmentComplex",
        "waterPark",
        "neighborhood",
        "governmentPlaza",
        "diplomaticQuarter",
        "preserve",
        "aqueduct",
        "canal",
        "dam",
      ];

      if (knownImages.includes(camelCaseName)) {
        return `./districtImg/${camelCaseName}.webp`;
      }
      return null;
    };

    // Generate hexagon coordinates
    const generateHexagons = (gridRadius) => {
      const hexes = [];
      for (let q = -gridRadius; q <= gridRadius; q++) {
        for (let r = -gridRadius; r <= gridRadius; r++) {
          if (Math.abs(q + r) <= gridRadius) {
            hexes.push({
              q,
              r,
              s: -q - r,
              id: `${q},${r}`,
              tile: null,
            });
          }
        }
      }
      return hexes;
    };

    // On component mount: load saved hex data into grid
    React.useEffect(() => {
      const saved = loadSavedHexData();
      const initialGrid = generateHexagons(radius).map((hex) => {
        const savedHex = saved.find((h) => h.id === hex.id);
        return savedHex ? { ...hex, tile: savedHex.tile } : hex;
      });
      console.log(
        "Loading saved hex data on mount:",
        initialGrid.filter((h) => h.tile)
      );
      setHexagons(initialGrid);
      // Skip saving initial load
      isInitialMount.current = false;
    }, []);

    // On radius change: regenerate grid preserving existing tile data
    const isRadiusMount = React.useRef(true);
    React.useEffect(() => {
      if (isRadiusMount.current) {
        isRadiusMount.current = false;
        return;
      }
      setHexagons((prev) => {
        const newGrid = generateHexagons(radius);
        const merged = newGrid.map((hex) => {
          const existing = prev.find((h) => h.id === hex.id);
          return existing ? { ...hex, tile: existing.tile } : hex;
        });
        console.log(
          "Radius change - preserving existing tiles:",
          merged.filter((h) => h.tile)
        );
        return merged;
      });
    }, [radius]);

    // Add wheel event listener with passive: false to allow preventDefault
    React.useEffect(() => {
      const svgElement = svgRef.current;
      if (!svgElement) return;

      const wheelHandler = (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom((prevZoom) =>
          Math.max(0.5, Math.min(3, prevZoom * zoomFactor))
        );
      };

      svgElement.addEventListener("wheel", wheelHandler, { passive: false });

      return () => {
        svgElement.removeEventListener("wheel", wheelHandler);
      };
    }, []);

    // Get terrain color mapping
    const getTerrainColor = (terrainType) => {
      const terrainColors = {
        Plains: "#fde68a", // yellow
        Grassland: "#10b981", // green
        Desert: "#f59e0b", // orange
        Tundra: "#6b7280", // gray
        Snow: "#ffffff", // white
        Coast: "#7dd3fc", // light blue
        Ocean: "#1e40af", // dark blue
      };
      return terrainColors[terrainType] || "#9ca3af"; // default gray
    };

    // Generate pointy-top square path for terrain indicator
    const generateTerrainIndicator = (centerX, centerY, size) => {
      const indicatorSize = size * 0.3; // 30% of hex size
      const topY = centerY - size * 0.7; // Position at top of hex

      // Create a diamond/square rotated 45 degrees (pointy-top)
      const points = [
        { x: centerX, y: topY - indicatorSize * 0.5 }, // top point
        { x: centerX + indicatorSize * 0.5, y: topY }, // right point
        { x: centerX, y: topY + indicatorSize * 0.5 }, // bottom point
        { x: centerX - indicatorSize * 0.5, y: topY }, // left point
      ];

      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y} Z`;
    };

    // Generate pointy-bottom square path for appeal indicator (mirrored)
    /* Disabled: appeal indicators are not ready for production
    const generateAppealIndicator = (centerX, centerY, size) => {
      const indicatorSize = size * 0.3;
      const bottomY = centerY + size * 0.7; // Position at bottom of hex

      const points = [
        { x: centerX, y: bottomY - indicatorSize * 0.5 }, // top point of diamond
        { x: centerX + indicatorSize * 0.5, y: bottomY }, // right
        { x: centerX, y: bottomY + indicatorSize * 0.5 }, // bottom
        { x: centerX - indicatorSize * 0.5, y: bottomY }, // left
      ];

      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y} Z`;
    };
    */

    // Disabled appeal coloring — appeal indicator currently turned off
    /*
    const getAppealColor = (appeal) => {
      if (appeal > 0) return "#10b981"; // green
      if (appeal < 0) return "#ef4444"; // red
      return "#6b7280"; // neutral gray
    };
    */

    // Calculate total appeal for a hex tile (disabled)
    /*
    const calculateTileAppeal = (hex) => {
      if (!hex.tile) return 0;

      let totalAppeal = 0;

      // Get appeal from each component of the tile
      const checkAppeal = (tileName) => {
        if (!tileName) return 0;
        const tileData = tiles.find((t) => t.name === tileName);
        return tileData?.appeal || 0;
      };

      // Add appeal from each tile component
      totalAppeal += checkAppeal(hex.tile.terrain);
      totalAppeal += checkAppeal(hex.tile.feature);
      totalAppeal += checkAppeal(hex.tile.district);
      totalAppeal += checkAppeal(hex.tile.wonder);
      totalAppeal += checkAppeal(hex.tile.naturalWonder);
      totalAppeal += checkAppeal(hex.tile.tileImprovement);

      return totalAppeal;
    };
    */

    // Calculate adjacency bonuses for a district or wonder (returns object with multiple yield types)
    const calculateAdjacencyBonuses = (hex) => {
      if (!hex.tile) return {};

      const displayInfo = getTileDisplayInfo(hex.tile);
      if (!displayInfo) return {};

      console.log(
        "calculateAdjacencyBonuses called for:",
        displayInfo.name,
        "type:",
        displayInfo.type
      );

      // Handle Wonders separately: Ludwig grants culture to Wonders based on adjacent districts
      if (displayInfo.type === "Wonder" || displayInfo.type === "wonder") {
        console.log("Processing Wonder:", displayInfo.name);
        const adjacentHexes = getAdjacentHexes(hex);
        let adjacentDistrictCount = 0;
        adjacentHexes.forEach((adj) => {
          if (!adj || !adj.tile) return;
          const adjInfo = getTileDisplayInfo(adj.tile);
          if (adjInfo && adjInfo.type === "district") {
            adjacentDistrictCount += 1;
            console.log("Found adjacent district:", adjInfo.name, "for Wonder");
          }
        });

        const isBBG = settings?.version === "Better Balanced Game Mod";
        const isGS =
          settings?.version === "Gathering Storm" || !settings?.version;

        const ludwigSetting = adjacencySettingsData.find(
          (s) => s.title === "Ludwig"
        );
        const isLudwig =
          ludwigSetting &&
          adjacencySettings &&
          adjacencySettings[ludwigSetting.originalKey];
        const ludwigPostSetting = adjacencySettingsData.find(
          (s) => s.title === "Ludwig post Drama & Poetry"
        );
        const isLudwigPost =
          ludwigPostSetting &&
          adjacencySettings &&
          adjacencySettings[ludwigPostSetting.originalKey];

        console.log("Wonder debug:", {
          adjacentDistrictCount,
          isLudwig,
          isLudwigPost,
          isBBG,
          isGS,
          ludwigSetting: ludwigSetting?.title,
          ludwigPostSetting: ludwigPostSetting?.title,
          version: settings?.version,
        });

        let bonuses = {};
        if ((isLudwig || isLudwigPost) && adjacentDistrictCount > 0) {
          // Post Drama & Poetry gives +2 culture per adjacent district (if enabled)
          if (isLudwigPost) {
            bonuses["culture"] = 2 * adjacentDistrictCount;
            console.log(
              "Applied Ludwig Post Drama & Poetry bonus:",
              bonuses["culture"]
            );
            return bonuses;
          }

          // Ludwig base behavior depends on version
          if (isGS) {
            bonuses["culture"] = 2 * adjacentDistrictCount;
            console.log("Applied Ludwig GS bonus:", bonuses["culture"]);
          } else if (isBBG) {
            bonuses["culture"] = 1 * adjacentDistrictCount;
            console.log("Applied Ludwig BBG bonus:", bonuses["culture"]);
          }
        }

        console.log("Wonder final bonuses:", bonuses);
        return bonuses;
      }

      // Continue with district logic
      if (displayInfo.type !== "district") return {};

      const tileData = tiles.find((t) => t.name === displayInfo.name);
      if (!tileData) return {};

      const adjacentHexes = getAdjacentHexes(hex);
      let bonus = 0;
      // Track minor adjacencies separately so we can apply Japan leader effects to districtMinorAdjacencies
      let districtMinorAdjCount = 0;
      let otherMinorAdjCount = 0;
      // General adjacent district count (used for Ludwig wonder bonuses)
      let adjacentDistrictCount = 0;
      // Track Arabia BBG adjacency bonuses:
      // - arabiaFaithAdjCount: number of adjacent Campuses to a Holy Site (+faith to Holy Site)
      // - arabiaScienceAdjCount: number of adjacent Holy Sites to a Campus (+science to Campus)
      let arabiaFaithAdjCount = 0;
      let arabiaScienceAdjCount = 0;
      // When Khmer (GS) grants Food equal to faith adjacency, defer setting until after all faith modifiers
      let khmerGrantFoodFromFaith = false;
      // Track Mbande Nzinga adjacency count for Mbanza tiles
      let mbanzaAdjCount = 0;
      // Norway adjacency counters
      let woodsAdjCount = 0; // adjacent woods/forest
      let coastAdjCount = 0; // adjacent coast terrain
      let holySiteAdjCount = 0; // adjacent Holy Sites (for Harbor bonuses)
      let hasRiverAdjacency = false;

      // Check for river adjacency (special case for Commercial Hub)
      if (displayInfo.name === "Commercial Hub") {
        // Check if this hex has any river edges
        const riverEdges = hex.tile?.hasRiverEdges;
        if (riverEdges) {
          hasRiverAdjacency = Object.values(riverEdges).some(
            (edge) => edge === true
          );
        }
      }

      // Check version-specific bonuses
      const isBBG = settings?.version === "Better Balanced Game Mod";
      const isGS =
        settings?.version === "Gathering Storm" || !settings?.version; // Default to GS if no version specified

      // Determine if Arabia leader setting is enabled in adjacency settings
      const arabiaSetting = adjacencySettingsData.find(
        (s) => s.title === "Arabia"
      );
      const isArabia =
        arabiaSetting &&
        adjacencySettings &&
        adjacencySettings[arabiaSetting.originalKey];
      const isArabiaBBG = isBBG && Boolean(isArabia);
      // Determine if Theodora leader setting is enabled in adjacency settings
      const theodoraSetting = adjacencySettingsData.find(
        (s) => s.title === "Theodora"
      );
      const isTheodora =
        theodoraSetting &&
        adjacencySettings &&
        adjacencySettings[theodoraSetting.originalKey];
      // Determine if Khmer leader setting is enabled in adjacency settings
      const khmerSetting = adjacencySettingsData.find(
        (s) => s.title === "Khmer"
      );
      const isKhmer =
        khmerSetting &&
        adjacencySettings &&
        adjacencySettings[khmerSetting.originalKey];
      // Determine if Mbande Nzinga leader setting is enabled in adjacency settings
      const mbandeSetting = adjacencySettingsData.find(
        (s) =>
          s.title === "Mbande Nzinga" || s.title === "Mbande Nzinga (Mbanza)"
      );
      const isMbande =
        mbandeSetting &&
        adjacencySettings &&
        adjacencySettings[mbandeSetting.originalKey];
      const isMbandeBBG = isBBG && Boolean(isMbande);
      // Determine if Ludwig leader setting is enabled in adjacency settings
      const ludwigSetting = adjacencySettingsData.find(
        (s) => s.title === "Ludwig" || s.title.includes("Ludwig")
      );
      const isLudwig =
        ludwigSetting &&
        adjacencySettings &&
        adjacencySettings[ludwigSetting.originalKey];
      // Check for a separate Ludwig (Post Drama & Poetry) setting if present
      const ludwigPostSetting = adjacencySettingsData.find(
        (s) => s.title.includes("Ludwig") && s.title.includes("Drama")
      );
      const isLudwigPost =
        ludwigPostSetting &&
        adjacencySettings &&
        adjacencySettings[ludwigPostSetting.originalKey];
      // Determine if Norway leader setting is enabled in adjacency settings
      const norwaySetting = adjacencySettingsData.find(
        (s) => s.title === "Norway"
      );
      const isNorway =
        norwaySetting &&
        adjacencySettings &&
        adjacencySettings[norwaySetting.originalKey];
      const isNorwayGS = isNorway && isGS;
      const isNorwayBBG = isNorway && isBBG;

      // Special case for Seowon district
      if (displayInfo.name === "Seowon") {
        // Base adjacency bonus depends on version
        if (isBBG) {
          bonus += 1; // +1 base science for BBG
        } else if (isGS) {
          bonus += 4; // +4 base science for Gathering Storm
        }

        // Count adjacent districts for version-specific penalties/bonuses
        let adjacentDistrictCount = 0;
        let adjacentMineCount = 0;

        adjacentHexes.forEach((adjacentHex) => {
          if (!adjacentHex.tile) return;

          const adjacentDisplayInfo = getTileDisplayInfo(adjacentHex.tile);
          if (!adjacentDisplayInfo) return;

          // Count districts
          if (adjacentDisplayInfo.type === "district") {
            adjacentDistrictCount += 1;
          }

          // Count mines for BBG
          if (isBBG && adjacentDisplayInfo.name === "Mine") {
            adjacentMineCount += 1;
          }
        });

        // Apply version-specific district effects
        if (isGS) {
          // Gathering Storm: -1 science for each adjacent district
          bonus -= adjacentDistrictCount;
        } else if (isBBG) {
          // BBG: minor adjacency from mines (floored)
          bonus += Math.floor(adjacentMineCount / 2);
        }

        // For Seowon, we bypass the normal adjacency calculation but still apply adjacency settings
        const primaryYieldType = tileData.adjacencyYield || "science";
        let bonuses = { [primaryYieldType]: Math.max(0, bonus) }; // Ensure bonus doesn't go negative

        // Apply adjacency settings (multipliers and adjacent tile bonuses) to Seowon
        if (adjacencySettings && adjacencySettingsData.length > 0) {
          adjacencySettingsData.forEach((setting) => {
            if (!adjacencySettings[setting.originalKey]) return; // Setting not enabled using original key

            // Check if this district is affected by the setting
            const isAffected = Array.isArray(setting.districtAffected)
              ? setting.districtAffected.includes(displayInfo.name)
              : setting.districtAffected === displayInfo.name;

            if (isAffected) {
              // Apply multiplier settings
              if (setting.multiplier) {
                bonuses[primaryYieldType] *= setting.multiplier;
              }
            }
          });
        }

        return bonuses;
      }

      adjacentHexes.forEach((adjacentHex) => {
        if (!adjacentHex.tile) return;

        const adjacentDisplayInfo = getTileDisplayInfo(adjacentHex.tile);
        if (!adjacentDisplayInfo) return;

        const adjacentTileName = adjacentDisplayInfo.name;

        // Count adjacent districts for Ludwig (wonders)
        if (adjacentDisplayInfo.type === "district") {
          adjacentDistrictCount += 1;
        }

        // Count adjacent Mbanza for Mbande Nzinga effects
        if (adjacentTileName === "Mbanza") {
          mbanzaAdjCount += 1;
        }
        // Count adjacent woods/forest for Norway (GS)
        if (
          adjacentHex.tile.feature &&
          (adjacentHex.tile.feature === "Woods" ||
            adjacentHex.tile.feature === "Forest")
        ) {
          woodsAdjCount += 1;
        }
        // Count adjacent coast tiles for Norway (BBG)
        if (adjacentHex.tile.terrain && adjacentHex.tile.terrain === "Coast") {
          coastAdjCount += 1;
        }
        // Count adjacent Holy Sites for Harbor bonuses
        if (adjacentTileName === "Holy Site") {
          holySiteAdjCount += 1;
        }

        // Special BBG rule: Commercial Hub gets normal adjacency from City Center
        if (
          displayInfo.name === "Commercial Hub" &&
          isBBG &&
          adjacentTileName === "City Center"
        ) {
          bonus += 1;
          return;
        }

        // Arabia + BBG special case: Holy Site <-> Campus grant +1 faith each
        if (isArabiaBBG) {
          if (
            displayInfo.name === "Holy Site" &&
            adjacentTileName === "Campus"
          ) {
            arabiaFaithAdjCount += 1;
          } else if (
            displayInfo.name === "Campus" &&
            adjacentTileName === "Holy Site"
          ) {
            // Campus adjacent to Holy Site => Campus gets +1 science under Arabia+BBG
            arabiaScienceAdjCount += 1;
          }
          // Do not return; allow these tiles to also count for other adjacency categories
        }

        // Check all adjacency categories - tiles can contribute to multiple categories

        // Check minor adjacencies (count for flooring)
        if (tileData.districtMinorAdjacencies?.includes(adjacentTileName)) {
          districtMinorAdjCount += 1;
        }

        // Check other minor adjacencies (count for flooring)
        if (tileData.otherMinorAdjacencies?.includes(adjacentTileName)) {
          otherMinorAdjCount += 1;
        }

        // Check normal adjacencies (1 point each)
        if (tileData.normalAdjacencies?.includes(adjacentTileName)) {
          bonus += 1;
        }

        // Check major adjacencies (2 points each)
        if (tileData.majorAdjacencies?.includes(adjacentTileName)) {
          // Skip "River" from majorAdjacencies for Commercial Hub - handled separately
          if (
            displayInfo.name === "Commercial Hub" &&
            adjacentTileName === "River"
          ) {
            // Don't add major adjacency bonus for rivers on Commercial Hub
          } else {
            bonus += 2;
          }
        }
      });

      // Floor minor adjacencies: every 2 minor adjacencies = +1 bonus
      // District minor adjacencies are doubled when Japan is active
      const japanSetting = adjacencySettingsData.find(
        (s) => s.title === "Japan"
      );
      const isJapan =
        japanSetting &&
        adjacencySettings &&
        adjacencySettings[japanSetting.originalKey];

      const districtMultiplier = isJapan ? 2 : 1;
      bonus += Math.floor(
        (districtMinorAdjCount * districtMultiplier + otherMinorAdjCount) / 2
      );

      // Special Commercial Hub river behavior:
      // - Default: +2 if adjacent to one or more rivers
      // - When Japan + BBG: Commercial Hubs adjacent to rivers get -2 adjacency instead
      if (displayInfo.name === "Commercial Hub" && hasRiverAdjacency) {
        if (isBBG && isJapan) {
          bonus += 0;
        } else {
          bonus += 2;
        }
      }

      // Start with the primary yield type
      const primaryYieldType = tileData.adjacencyYield || "gold";
      const bonuses = { [primaryYieldType]: bonus };

      // Arabia + BBG: apply faith adjacency from Campus<->Holy Site
      if (isArabiaBBG && arabiaFaithAdjCount > 0) {
        bonuses["faith"] = (bonuses["faith"] || 0) + arabiaFaithAdjCount;
      }
      if (isArabiaBBG && arabiaScienceAdjCount > 0) {
        bonuses["science"] = (bonuses["science"] || 0) + arabiaScienceAdjCount;
      }

      // Apply adjacency settings (multipliers and adjacent tile bonuses first)
      if (adjacencySettings && adjacencySettingsData.length > 0) {
        adjacencySettingsData.forEach((setting) => {
          if (!adjacencySettings[setting.originalKey]) return; // Setting not enabled using original key

          // Check if this district is affected by the setting
          const isAffected = Array.isArray(setting.districtAffected)
            ? setting.districtAffected.includes(displayInfo.name)
            : setting.districtAffected === displayInfo.name;

          if (isAffected) {
            // Apply multiplier settings
            if (setting.multiplier) {
              bonuses[primaryYieldType] *= setting.multiplier;
            }

            // Apply adjacent tile bonus settings
            if (setting.adjacentTile) {
              let adjacentTileBonus = 0;

              // Handle different adjacent tile types
              if (setting.adjacentTile.toLowerCase() === "river") {
                // Check for river edges
                if (
                  hasRiverAdjacency ||
                  (hex.tile?.hasRiverEdges &&
                    Object.values(hex.tile.hasRiverEdges).some(
                      (edge) => edge === true
                    ))
                ) {
                  adjacentTileBonus += 1;
                }
              } else {
                // Check adjacent hexes for specific terrain/feature types
                adjacentHexes.forEach((adjacentHex) => {
                  if (!adjacentHex.tile) return;

                  // Check terrain type
                  if (
                    adjacentHex.tile.terrain &&
                    adjacentHex.tile.terrain.toLowerCase() ===
                      setting.adjacentTile.toLowerCase()
                  ) {
                    adjacentTileBonus += 1;
                  }

                  // Check feature type
                  if (
                    adjacentHex.tile.feature &&
                    adjacentHex.tile.feature.toLowerCase() ===
                      setting.adjacentTile.toLowerCase()
                  ) {
                    adjacentTileBonus += 1;
                  }
                });
              }

              bonuses[primaryYieldType] += adjacentTileBonus;
            }
          }
        });

        // Apply additional yield settings after all base calculations (like Free Inquiry)
        adjacencySettingsData.forEach((setting) => {
          if (!adjacencySettings[setting.originalKey]) return; // Setting not enabled using original key

          // Check if this district is affected by the setting
          const isAffected = Array.isArray(setting.districtAffected)
            ? setting.districtAffected.includes(displayInfo.name)
            : setting.districtAffected === displayInfo.name;

          if (isAffected && setting.additionalYield) {
            const additionalYieldType = setting.additionalYield.type;
            if (setting.additionalYield.formula === "gold_adjacency") {
              // For Free Inquiry: science adjacency equals final gold adjacency (after multipliers)
              bonuses[additionalYieldType] = bonuses[primaryYieldType];
            }
          }
        });
      }

      // Mbande Nzinga + BBG: Commercial Hubs get +2 gold per adjacent Mbanza; Theater Squares get +2 culture per adjacent Mbanza
      if (isMbandeBBG && mbanzaAdjCount > 0) {
        if (displayInfo.name === "Commercial Hub") {
          bonuses["gold"] = (bonuses["gold"] || 0) + 2 * mbanzaAdjCount;
        }
        if (displayInfo.name === "Theater Square") {
          bonuses["culture"] = (bonuses["culture"] || 0) + 2 * mbanzaAdjCount;
        }
      }

      // Ludwig leader effects: Wonders gain culture per adjacent district
      if (isLudwig && adjacentDistrictCount > 0) {
        if (isGS) {
          // Gathering Storm: +2 culture per adjacent district
          if (displayInfo.type === "Wonder" || displayInfo.type === "Wonder") {
            bonuses["culture"] =
              (bonuses["culture"] || 0) + 2 * adjacentDistrictCount;
          }
        } else if (isBBG) {
          // Better Balanced Game: +1 culture per adjacent district
          if (displayInfo.type === "Wonder" || displayInfo.type === "Wonder") {
            bonuses["culture"] =
              (bonuses["culture"] || 0) + 1 * adjacentDistrictCount;
          }
        }
      }

      // Additional Ludwig Post Drama & Poetry bonus (if separate setting)
      if (isLudwigPost && adjacentDistrictCount > 0) {
        if (displayInfo.type === "Wonder" || displayInfo.type === "Wonder") {
          bonuses["culture"] =
            (bonuses["culture"] || 0) + 2 * adjacentDistrictCount;
        }
      }

      // Norway effects
      if (isNorwayGS && displayInfo.name === "Holy Site" && woodsAdjCount > 0) {
        // Gathering Storm: Holy Sites get +1 faith per adjacent woods/forest
        bonuses["faith"] = (bonuses["faith"] || 0) + 1 * woodsAdjCount;
      }
      if (isNorwayBBG) {
        if (displayInfo.name === "Holy Site" && coastAdjCount > 0) {
          // BBG: Holy Sites get +1 faith per adjacent Coast tile
          bonuses["faith"] = (bonuses["faith"] || 0) + 1 * coastAdjCount;
        }
        if (displayInfo.name === "Harbor" && holySiteAdjCount > 0) {
          // BBG: Harbors get +2 gold per adjacent Holy Site
          bonuses["gold"] = (bonuses["gold"] || 0) + 2 * holySiteAdjCount;
        }
      }

      // Special: River Goddess (version-dependent bonuses)
      if (adjacencySettings && adjacencySettingsData.length > 0) {
        // Theodora leader effects: apply before River Goddess adjustments
        if (isTheodora && displayInfo.name === "Holy Site") {
          // Gathering Storm: Holy Sites provide Culture equal to their adjacency bonus
          if (isGS) {
            const primary = bonuses[primaryYieldType] || 0;
            bonuses["culture"] = primary;
          }

          // Better Balanced Game: Holy Sites receive +1 culture per adjacent district
          if (isBBG) {
            let adjacentDistrictCount = 0;
            adjacentHexes.forEach((adj) => {
              if (!adj.tile) return;
              const adjInfo = getTileDisplayInfo(adj.tile);
              if (adjInfo && adjInfo.type === "district")
                adjacentDistrictCount += 1;
            });
            bonuses["culture"] =
              (bonuses["culture"] || 0) + adjacentDistrictCount;
          }
        }
        // Khmer leader effects (river-dependent): apply before River Goddess adjustments
        if (isKhmer && displayInfo.name === "Holy Site") {
          // Determine if this Holy Site is adjacent to ANY river edge
          const riverEdges = hex.tile?.hasRiverEdges;
          const hasRiver =
            riverEdges && Object.values(riverEdges).some((e) => e === true);

          if (hasRiver) {
            if (isGS) {
              // Gathering Storm: +2 faith and +2 housing
              bonuses["faith"] = (bonuses["faith"] || 0) + 2;
              bonuses["housing"] = (bonuses["housing"] || 0) + 2;
              // Defer setting food here; we'll set it after all faith modifiers are applied
              khmerGrantFoodFromFaith = true;
            } else if (isBBG) {
              // Better Balanced Game: +1 faith, +1 food, +2 housing
              bonuses["faith"] = (bonuses["faith"] || 0) + 1;
              bonuses["food"] = (bonuses["food"] || 0) + 1;
              bonuses["housing"] = (bonuses["housing"] || 0) + 2;
            }
          }
        }
        const riverGoddess = adjacencySettingsData.find(
          (s) => s.title === "River Goddess" && adjacencySettings[s.originalKey]
        );

        if (riverGoddess && displayInfo.name === "Holy Site") {
          // Determine if this Holy Site is adjacent to ANY river edge
          const riverEdges = hex.tile?.hasRiverEdges;
          const hasRiver =
            riverEdges && Object.values(riverEdges).some((e) => e === true);
          if (hasRiver) {
            if (settings?.version === "Better Balanced Game Mod") {
              // +1 faith adjacency (add to existing), +1 housing, +1 amenities
              bonuses["faith"] = (bonuses["faith"] || 0) + 1;
              bonuses["housing"] = (bonuses["housing"] || 0) + 1;
              bonuses["amenities"] = (bonuses["amenities"] || 0) + 1;
            } else {
              // Gathering Storm (or default): +2 housing, +2 amenities (no faith change)
              bonuses["housing"] = (bonuses["housing"] || 0) + 2;
              bonuses["amenities"] = (bonuses["amenities"] || 0) + 2;
            }
          }
        }
        // If Khmer (GS) wanted food equal to faith adjacency, set it now using the final faith value
        if (khmerGrantFoodFromFaith) {
          bonuses["food"] = bonuses["faith"] || 0;
        }
      }

      return bonuses;
    };

    // Legacy function for backward compatibility - returns primary yield bonus
    const calculateAdjacencyBonus = (hex) => {
      const bonuses = calculateAdjacencyBonuses(hex);
      const primaryYieldType = getDistrictYieldType(hex);
      return bonuses[primaryYieldType] || 0;
    };

    // Get the yield type for a district's adjacency bonus
    const getDistrictYieldType = (hex) => {
      if (!hex.tile || !tileHasContent(hex.tile, "district")) return null;

      const displayInfo = getTileDisplayInfo(hex.tile);
      if (!displayInfo || displayInfo.type !== "district") return null;

      const tileData = tiles.find((t) => t.name === displayInfo.name);
      return tileData?.adjacencyYield || null;
    };

    // Calculate effective range for a tile (districts and other items like wonders can define a range)
    const getEffectiveRange = (hex) => {
      if (!hex.tile) return 0;

      const displayInfo = getTileDisplayInfo(hex.tile);
      if (!displayInfo) return 0;

      const tileData = tiles.find((t) => t.name === displayInfo.name);
      if (!tileData || !tileData.range) return 0;

      let effectiveRange = tileData.range;

      // Apply Mexico City suzerain bonus only for specific districts
      if (
        cityStateSettings?.mexicoCitySuzerain &&
        displayInfo.type === "district"
      ) {
        const affectedDistricts = [
          "Industrial Zone",
          "Entertainment Complex",
          "Water Park",
        ];
        if (affectedDistricts.includes(displayInfo.name)) {
          effectiveRange += 3;
        }
      }

      return effectiveRange;
    };

    // Get adjacent hexes for a given hex
    const getAdjacentHexes = (hex) => {
      const directions = [
        { q: 0, r: -1 }, // northwest
        { q: 1, r: -1 }, // northeast
        { q: 1, r: 0 }, // east
        { q: 0, r: 1 }, // southeast
        { q: -1, r: 1 }, // southwest
        { q: -1, r: 0 }, // west
      ];

      return directions
        .map((dir) => {
          const adjacentQ = hex.q + dir.q;
          const adjacentR = hex.r + dir.r;
          const adjacentId = `${adjacentQ},${adjacentR}`;
          return hexagons.find((h) => h.id === adjacentId);
        })
        .filter(Boolean);
    };

    // Check if a district has any adjacency bonuses defined
    const districtHasAdjacencyBonuses = (hex) => {
      if (!hex.tile || !tileHasContent(hex.tile, "district")) return false;

      const displayInfo = getTileDisplayInfo(hex.tile);
      if (!displayInfo || displayInfo.type !== "district") return false;

      // Special cases that have hardcoded adjacency logic
      if (displayInfo.name === "Seowon") return true;

      const tileData = tiles.find((t) => t.name === displayInfo.name);
      if (!tileData) return false;

      return !!(
        tileData.districtMinorAdjacencies ||
        tileData.otherMinorAdjacencies ||
        tileData.normalAdjacencies ||
        tileData.majorAdjacencies
      );
    };

    // Get hexes within a specific range of a given hex
    const getHexesInRange = (centerHex, range) => {
      if (!range || range <= 0) return [];

      const hexesInRange = [];
      for (let q = -range; q <= range; q++) {
        for (
          let r = Math.max(-range, -q - range);
          r <= Math.min(range, -q + range);
          r++
        ) {
          const targetQ = centerHex.q + q;
          const targetR = centerHex.r + r;
          const distance = (Math.abs(q) + Math.abs(r) + Math.abs(-q - r)) / 2;

          if (distance <= range && distance > 0) {
            // Exclude the center hex itself
            const targetId = `${targetQ},${targetR}`;
            const targetHex = hexagons.find((h) => h.id === targetId);
            if (targetHex) {
              hexesInRange.push(targetHex);
            }
          }
        }
      }
      return hexesInRange;
    };

    // Check if a hex should be highlighted based on hover state
    const isHexHighlighted = (hex) => {
      // If a persistent selection exists, use that
      if (selectedRange) {
        const centerHex = hexagons.find((h) => h.id === selectedRange.centerId);
        if (centerHex) {
          const hexesInRange = getHexesInRange(centerHex, selectedRange.radius);
          if (hexesInRange.some((h) => h.id === hex.id)) return true;
        }
      }

      if (!hoveredHex) return false;

      const hoveredTile = hoveredHex.tile;
      if (!hoveredTile) return false;

      const displayInfo = getTileDisplayInfo(hoveredTile);
      if (!displayInfo) return false;

      const tileData = tiles.find((t) => t.name === displayInfo.name);
      if (!tileData || !tileData.range) return false;

      // Check if this hex is within range of the hovered hex (using effective range with bonuses)
      const effectiveRange = getEffectiveRange(hoveredHex);
      const hexesInRange = getHexesInRange(hoveredHex, effectiveRange);
      return hexesInRange.some((h) => h.id === hex.id);
    };

    // Convert hex coordinates to pixel coordinates (pointy-top orientation)
    const hexToPixel = (hex, size) => {
      const x = size * (Math.sqrt(3) * hex.q + (Math.sqrt(3) / 2) * hex.r);
      const y = size * ((3 / 2) * hex.r);
      return { x, y };
    };

    // Generate SVG path for hexagon (pointy-top orientation)
    const generateHexPath = (centerX, centerY, size) => {
      const points = [];
      for (let i = 0; i < 6; i++) {
        // Add Math.PI/6 (30 degrees) to rotate hexagon to pointy-top
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const x = centerX + size * Math.cos(angle);
        const y = centerY + size * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      return `M ${points.join(" L ")} Z`;
    };

    // Generate river edge path for a specific edge
    const generateRiverEdgePath = (centerX, centerY, size, edge) => {
      const edgeAngles = {
        northeast: 4, // Top-right edge
        east: 5, // Bottom-right edge
        southeast: 0, // Bottom edge
        southwest: 1, // Bottom-left edge
        west: 2, // Top-left edge
        northwest: 3, // Top edge
      };

      const edgeIndex = edgeAngles[edge];
      if (edgeIndex === undefined) return null;

      // Calculate the two corner points for this edge
      const angle1 = (Math.PI / 3) * edgeIndex + Math.PI / 6;
      const angle2 = (Math.PI / 3) * (edgeIndex + 1) + Math.PI / 6;

      const x1 = centerX + size * Math.cos(angle1);
      const y1 = centerY + size * Math.sin(angle1);
      const x2 = centerX + size * Math.cos(angle2);
      const y2 = centerY + size * Math.sin(angle2);

      return `M ${x1},${y1} L ${x2},${y2}`;
    };

    // Calculate which edge of a hexagon was clicked based on click position
    const getClickedEdge = (hex, event, centerX, centerY, size) => {
      const rect = svgRef.current.getBoundingClientRect();
      const svgElement = svgRef.current;
      const point = svgElement.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const svgPoint = point.matrixTransform(
        svgElement.getScreenCTM().inverse()
      );

      // Apply pan and zoom transformations
      const clickX = (svgPoint.x - pan.x) / zoom - centerX;
      const clickY = (svgPoint.y - pan.y) / zoom - centerY;

      const distance = Math.sqrt(clickX * clickX + clickY * clickY);

      // Only consider edge clicks if near the hex edge
      if (distance < size * 0.6 || distance > size * 1.1) return null;

      // Calculate angle from center to click point
      let angle = Math.atan2(clickY, clickX);
      if (angle < 0) angle += 2 * Math.PI;

      // Convert to degrees and normalize to hex orientation
      const degrees = ((angle * 180) / Math.PI + 30) % 360;

      // Determine which edge based on angle
      if (degrees >= 330 || degrees < 30) return "east";
      if (degrees >= 30 && degrees < 90) return "southeast";
      if (degrees >= 90 && degrees < 150) return "southwest";
      if (degrees >= 150 && degrees < 210) return "west";
      if (degrees >= 210 && degrees < 270) return "northwest";
      if (degrees >= 270 && degrees < 330) return "northeast";

      return null;
    };

    // Handle edge clicks for river placement
    const handleEdgeClick = (hex, event, centerX, centerY, size) => {
      if (selectedFillType !== "river" || !onEdgeClick) return false;

      const edge = getClickedEdge(hex, event, centerX, centerY, size);
      if (edge && onEdgeClick) {
        event.stopPropagation();
        onEdgeClick(hex.id, edge);
        return true;
      }
      return false;
    };

    const handleHexClick = (hex, event) => {
      if (!isDragging) {
        event.preventDefault();

        // Check if this is an edge click for river mode
        const size = 30;
        const pixel = hexToPixel(hex, size);
        const centerX = pixel.x;
        const centerY = pixel.y;

        if (handleEdgeClick(hex, event, centerX, centerY, size)) {
          return; // Edge click handled, don't proceed with hex click
        }

        const clickType = event.type === "contextmenu" ? "right" : "left";
        onHexClick(hex.id, { q: hex.q, r: hex.r, s: hex.s }, clickType);

        // Toggle persistent range highlighting when left-clicking a tile that has a range
        if (clickType === "left") {
          const effectiveRange = getEffectiveRange(hex);
          if (effectiveRange && effectiveRange > 0) {
            if (selectedRange && selectedRange.centerId === hex.id) {
              // Clicking again clears the selection
              setSelectedRange(null);
            } else {
              setSelectedRange({ centerId: hex.id, radius: effectiveRange });
            }
          }
        }
      }
    };

    const handleHexMouseEnter = (hex) => {
      if (!isDragging) {
        setHoveredHex(hex);
      }
    };

    const handleHexMouseLeave = () => {
      setHoveredHex(null);
    };

    // Mouse event handlers for pan functionality
    const handleMouseDown = (e) => {
      setIsDragging(false);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e) => {
      if (dragStart.x !== 0 || dragStart.y !== 0) {
        const deltaX = Math.abs(e.clientX - (dragStart.x + pan.x));
        const deltaY = Math.abs(e.clientY - (dragStart.y + pan.y));

        if (deltaX > 5 || deltaY > 5) {
          setIsDragging(true);
        }

        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setDragStart({ x: 0, y: 0 });
      setTimeout(() => setIsDragging(false), 100);
    };

    // Calculate bounds for all hexagons to prevent clipping
    const calculateBounds = () => {
      if (hexagons.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

      const size = 30;
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;

      hexagons.forEach((hex) => {
        const pixel = hexToPixel(hex, size);
        // Account for hexagon radius in bounds calculation
        const hexRadius = size;
        minX = Math.min(minX, pixel.x - hexRadius);
        maxX = Math.max(maxX, pixel.x + hexRadius);
        minY = Math.min(minY, pixel.y - hexRadius);
        maxY = Math.max(maxY, pixel.y + hexRadius);
      });

      return { minX, maxX, minY, maxY };
    };

    const updateHexTile = (hexId, tileData) => {
      setHexagons((prev) => {
        // Use the river edge synchronization utility
        return updateRiverEdges(prev, hexId, tileData);
      });
    };

    const getHexTileData = (hexId) => {
      const hex = hexagons.find((h) => h.id === hexId);
      return hex?.tile || null;
    };

    const clearHexData = () => {
      setHexagons((prev) => prev.map((hex) => ({ ...hex, tile: null })));
      localStorage.removeItem(HEX_PLANNER_DATA_KEY);
      // Clear any persistent range selection when tiles are cleared
      setSelectedRange(null);
    };

    useImperativeHandle(
      ref,
      () => ({
        updateHexTile,
        getHexTileData,
        clearHexData,
        resetView: () => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        },
      }),
      [hexagons]
    );

    const size = 30;
    const bounds = calculateBounds();
    const padding = 60; // Increased padding to ensure no clipping

    // Calculate proper SVG dimensions based on actual hex bounds
    const svgWidth = bounds.maxX - bounds.minX + padding * 2;
    const svgHeight = bounds.maxY - bounds.minY + padding * 2;

    // Center offset to position hexagons in the middle of the SVG
    const centerOffsetX = -bounds.minX + padding;
    const centerOffsetY = -bounds.minY + padding;

    return (
      <div className="w-full h-[70vh] bg-gray-50 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            {hexagons
              .filter((hex) => tileHasActualContent(hex.tile))
              .map((hex) => {
                const imagePath = getImagePath(hex.tile);
                if (!imagePath) return null;
                return (
                  <pattern
                    key={`pattern-${hex.id}`}
                    id={`pattern-${hex.id.replace(",", "-")}`}
                    patternUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <image
                      href={imagePath}
                      width="60"
                      height="60"
                      x="-4"
                      y="0"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </pattern>
                );
              })
              .filter(Boolean)}
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            <g transform={`translate(${centerOffsetX}, ${centerOffsetY})`}>
              {hexagons.map((hex) => {
                const pixel = hexToPixel(hex, size);
                const centerX = pixel.x;
                const centerY = pixel.y;
                const path = generateHexPath(centerX, centerY, size);
                const displayInfo = hex.tile
                  ? getTileDisplayInfo(hex.tile)
                  : null;
                const imagePath = hex.tile ? getImagePath(hex.tile) : null;
                const adjacencyBonuses = calculateAdjacencyBonuses(hex);
                const yieldTypes = Object.keys(adjacencyBonuses);
                // Appeal indicator disabled — set to 0 to avoid rendering
                const tileAppeal = 0; // calculateTileAppeal(hex);
                const isHighlighted = isHexHighlighted(hex);

                return (
                  <g key={hex.id}>
                    {/* Hexagon */}
                    <path
                      d={path}
                      fill={
                        hex.tile && imagePath
                          ? `url(#pattern-${hex.id.replace(",", "-")})`
                          : hex.tile &&
                            (hex.tile.district ||
                              hex.tile.wonder ||
                              hex.tile.naturalWonder ||
                              hex.tile.feature ||
                              hex.tile.tileImprovement)
                          ? "#10b981"
                          : "#e5e7eb"
                      }
                      stroke={isHighlighted ? "#fbbf24" : "#374151"}
                      strokeWidth={isHighlighted ? "3" : "1"}
                      opacity={isHighlighted ? 0.8 : 1}
                      className="cursor-pointer hover:opacity-75 transition-all duration-200"
                      onClick={(e) => handleHexClick(hex, e)}
                      onContextMenu={(e) => handleHexClick(hex, e)}
                      onMouseEnter={() => handleHexMouseEnter(hex)}
                      onMouseLeave={handleHexMouseLeave}
                    />

                    {/* Terrain indicator - pointy-top square */}
                    {hex.tile?.terrain && (
                      <path
                        d={generateTerrainIndicator(centerX, centerY, size)}
                        fill={getTerrainColor(hex.tile.terrain)}
                        stroke="#000000"
                        strokeWidth="1"
                        opacity="0.9"
                        pointerEvents="none"
                      />
                    )}

                    {/* Appeal indicator - DISABLED
                    {hex.tile && tileAppeal !== 0 && (
                      <g pointerEvents="none">
                        <path
                          d={generateAppealIndicator(centerX, centerY, size)}
                          fill={getAppealColor(tileAppeal)}
                          stroke="#000000"
                          strokeWidth="1"
                          opacity="0.95"
                        />
                        <text
                          x={centerX}
                          y={centerY + size * 0.72}
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {tileAppeal}
                        </text>
                      </g>
                    )}
                    */}

                    {/* Tile content text - show features and improvements when not a district */}
                    {hex.tile && !hex.tile.district && !imagePath && (
                      <g pointerEvents="none">
                        {/* Collect all non-terrain content to display */}
                        {(() => {
                          const contentToShow = [];

                          // Add all features if present (new array format)
                          if (
                            hex.tile.features &&
                            hex.tile.features.length > 0
                          ) {
                            contentToShow.push(...hex.tile.features);
                          }
                          // Backward compatibility: add legacy feature if present and not in features array
                          else if (hex.tile.feature) {
                            contentToShow.push(hex.tile.feature);
                          }

                          // Add wonder if present
                          if (hex.tile.wonder) {
                            contentToShow.push(hex.tile.wonder);
                          }

                          // Add natural wonder if present
                          if (hex.tile.naturalWonder) {
                            contentToShow.push(hex.tile.naturalWonder);
                          }

                          // Add tile improvement if present
                          if (hex.tile.tileImprovement) {
                            contentToShow.push(hex.tile.tileImprovement);
                          }

                          // Render each piece of content
                          return contentToShow.map((content, index) => {
                            const truncatedContent =
                              content.length > 10
                                ? content.substring(0, 10) + "..."
                                : content;

                            // Stack text vertically, starting from center
                            const totalHeight = contentToShow.length * 12;
                            const yOffset =
                              centerY - totalHeight / 2 + index * 12;

                            return (
                              <text
                                key={`content-${index}`}
                                x={centerX}
                                y={yOffset}
                                textAnchor="middle"
                                fontSize="8"
                                fill="white"
                                fontWeight="bold"
                              >
                                {truncatedContent}
                              </text>
                            );
                          });
                        })()}
                      </g>
                    )}

                    {/* District name text (shown with image pattern) */}
                    {hex.tile &&
                      displayInfo &&
                      displayInfo.type === "district" &&
                      !imagePath && (
                        <text
                          x={centerX}
                          y={centerY - 5}
                          textAnchor="middle"
                          fontSize="8"
                          fill="white"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {displayInfo.name.length > 10
                            ? displayInfo.name.substring(0, 10) + "..."
                            : displayInfo.name}
                        </text>
                      )}

                    {/* Adjacency bonuses for districts and wonders */}
                    {hex.tile &&
                      ((tileHasContent(hex.tile, "district") &&
                        districtHasAdjacencyBonuses(hex)) ||
                        (displayInfo &&
                          (displayInfo.type === "Wonder" ||
                            displayInfo.type === "wonder"))) &&
                      yieldTypes.length > 0 && (
                        <g>
                          {yieldTypes.map((yieldType, index) => {
                            const bonus = adjacencyBonuses[yieldType];
                            if (bonus <= 0) return null;

                            // Stack bonuses upward above the hex center
                            const totalHeight = yieldTypes.length * 16;
                            const yOffset =
                              centerY + 20 - totalHeight + index * 16;

                            return (
                              <g key={`bonus-${yieldType}-${index}`}>
                                <rect
                                  x={centerX - 22}
                                  y={yOffset}
                                  width="44"
                                  height="14"
                                  fill="rgba(0, 0, 0, 0.8)"
                                  rx="2"
                                  pointerEvents="none"
                                />
                                <text
                                  x={centerX - 8}
                                  y={yOffset + 10}
                                  textAnchor="middle"
                                  fontSize="10"
                                  fill="gold"
                                  fontWeight="bold"
                                  pointerEvents="none"
                                >
                                  +{bonus}
                                </text>
                                {/* Yield icon */}
                                <image
                                  x={centerX + 8}
                                  y={yOffset + 1}
                                  width="12"
                                  height="12"
                                  href={`./yieldImg/${yieldType}.webp`}
                                  pointerEvents="none"
                                />
                              </g>
                            );
                          })}
                        </g>
                      )}

                    {/* River edges */}
                    {hex.tile && hex.tile.hasRiverEdges && (
                      <g>
                        {Object.entries(hex.tile.hasRiverEdges).map(
                          ([edge, hasRiver]) => {
                            if (!hasRiver) return null;
                            const riverPath = generateRiverEdgePath(
                              centerX,
                              centerY,
                              size,
                              edge
                            );
                            if (!riverPath) return null;

                            return (
                              <path
                                key={`river-${hex.id}-${edge}`}
                                d={riverPath}
                                stroke="#1e40af"
                                strokeWidth="6"
                                strokeLinecap="round"
                                pointerEvents="none"
                              />
                            );
                          }
                        )}
                      </g>
                    )}

                    {/* Edge hover overlays for river mode */}
                    {selectedFillType === "river" && (
                      <g>
                        {[
                          "northeast",
                          "east",
                          "southeast",
                          "southwest",
                          "west",
                          "northwest",
                        ].map((edge) => {
                          const riverPath = generateRiverEdgePath(
                            centerX,
                            centerY,
                            size,
                            edge
                          );
                          if (!riverPath) return null;

                          const hasRiver = hex.tile?.hasRiverEdges?.[edge];

                          return (
                            <path
                              key={`edge-hover-${hex.id}-${edge}`}
                              d={riverPath}
                              stroke={hasRiver ? "#1e40af" : "#94a3b8"}
                              strokeWidth="8"
                              strokeLinecap="round"
                              fill="none"
                              opacity={
                                hoveredEdge === `${hex.id}-${edge}` ? 0.8 : 0.3
                              }
                              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                              onMouseEnter={() =>
                                setHoveredEdge(`${hex.id}-${edge}`)
                              }
                              onMouseLeave={() => setHoveredEdge(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (onEdgeClick) {
                                  onEdgeClick(hex.id, edge);
                                }
                              }}
                              onContextMenu={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (onEdgeClick) {
                                  onEdgeClick(hex.id, edge, "right");
                                }
                              }}
                            />
                          );
                        })}
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>
    );
  }
);

CustomHexGrid.displayName = "CustomHexGrid";

export default CustomHexGrid;
