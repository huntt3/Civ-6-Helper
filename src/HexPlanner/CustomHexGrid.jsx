import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  getTileDisplayInfo,
  tileHasContent,
  tileHasActualContent,
  updateRiverEdges,
} from "../utils/hexPlannerUtils";

const HEX_PLANNER_DATA_KEY = "civ6-helper-hex-planner-data";

const CustomHexGrid = forwardRef(({ onHexClick, radius = 3 }, ref) => {
  // Hexagon grid state (initialized on mount)
  const [hexagons, setHexagons] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredHex, setHoveredHex] = useState(null);
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
      localStorage.setItem(HEX_PLANNER_DATA_KEY, JSON.stringify(hexDataToSave));
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
      setZoom((prevZoom) => Math.max(0.5, Math.min(3, prevZoom * zoomFactor)));
    };

    svgElement.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      svgElement.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  // Calculate adjacency bonus for a district
  const calculateAdjacencyBonus = (hex) => {
    if (!hex.tile || !tileHasContent(hex.tile, "district")) return 0;

    const displayInfo = getTileDisplayInfo(hex.tile);
    if (!displayInfo || displayInfo.type !== "district") return 0;

    const tileData = tiles.find((t) => t.name === displayInfo.name);
    if (!tileData) return 0;

    const adjacentHexes = getAdjacentHexes(hex);
    let bonus = 0;

    adjacentHexes.forEach((adjacentHex) => {
      if (!adjacentHex.tile) return;

      const adjacentDisplayInfo = getTileDisplayInfo(adjacentHex.tile);
      if (!adjacentDisplayInfo) return;

      const adjacentTileName = adjacentDisplayInfo.name;

      // Check minor adjacencies (0.5 points)
      if (tileData.districtMinorAdjacencies?.includes(adjacentTileName)) {
        bonus += 0.5;
      }
      // Check normal adjacencies (1 point)
      else if (tileData.normalAdjacencies?.includes(adjacentTileName)) {
        bonus += 1;
      }
      // Check major adjacencies (2 points)
      else if (tileData.majorAdjacencies?.includes(adjacentTileName)) {
        bonus += 2;
      }
    });

    return bonus;
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
    if (!hoveredHex) return false;

    const hoveredTile = hoveredHex.tile;
    if (!hoveredTile) return false;

    const displayInfo = getTileDisplayInfo(hoveredTile);
    if (!displayInfo) return false;

    const tileData = tiles.find((t) => t.name === displayInfo.name);
    if (!tileData || !tileData.range) return false;

    // Check if this hex is within range of the hovered hex
    const hexesInRange = getHexesInRange(hoveredHex, tileData.range);
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

  const handleHexClick = (hex, event) => {
    if (!isDragging) {
      event.preventDefault();
      const clickType = event.type === "contextmenu" ? "right" : "left";
      onHexClick(hex.id, { q: hex.q, r: hex.r, s: hex.s }, clickType);
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
              const adjacencyBonus = calculateAdjacencyBonus(hex);
              const isHighlighted = isHexHighlighted(hex);

              return (
                <g key={hex.id}>
                  {/* Hexagon */}
                  <path
                    d={path}
                    fill={
                      hex.tile && imagePath
                        ? `url(#pattern-${hex.id.replace(",", "-")})`
                        : tileHasActualContent(hex.tile)
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

                  {/* Tile name text */}
                  {hex.tile && displayInfo && !imagePath && (
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

                  {/* Adjacency bonus for districts */}
                  {hex.tile && tileHasContent(hex.tile, "district") && (
                    <g>
                      <rect
                        x={centerX - 15}
                        y={centerY + 8}
                        width="30"
                        height="14"
                        fill="rgba(0, 0, 0, 0.8)"
                        rx="2"
                        pointerEvents="none"
                      />
                      <text
                        x={centerX}
                        y={centerY + 18}
                        textAnchor="middle"
                        fontSize="10"
                        fill="gold"
                        fontWeight="bold"
                        pointerEvents="none"
                      >
                        +{adjacencyBonus}
                      </text>
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
                              strokeWidth="3"
                              strokeLinecap="round"
                              pointerEvents="none"
                            />
                          );
                        }
                      )}
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
});

CustomHexGrid.displayName = "CustomHexGrid";

export default CustomHexGrid;
