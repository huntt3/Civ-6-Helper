import React, { useState, forwardRef, useImperativeHandle } from "react";

const CustomHexGrid = forwardRef(({ onHexClick, radius = 3 }, ref) => {
  const [hexagons, setHexagons] = useState([]);
  const [tiles, setTiles] = useState([]);

  // Load tiles data on component mount
  React.useEffect(() => {
    fetch("./jsonFiles/Tiles.json")
      .then((res) => res.json())
      .then((data) => setTiles(data.Tiles || []))
      .catch(() => setTiles([]));
  }, []);

  // Helper function to convert tile name to camelCase filename
  const toCamelCase = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  };

  // Helper function to check if image exists
  const getImagePath = (tileName) => {
    if (!tileName) return null;
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

  // Initialize hexagons on first render and when radius changes
  React.useEffect(() => {
    setHexagons((prevHexagons) => {
      const newHexagons = generateHexagons(radius);
      // Preserve existing tile data when radius changes
      const preservedHexagons = newHexagons.map((newHex) => {
        const existingHex = prevHexagons.find((hex) => hex.id === newHex.id);
        return existingHex ? { ...newHex, tile: existingHex.tile } : newHex;
      });
      return preservedHexagons;
    });
  }, [radius]);

  // Calculate adjacency bonus for a district
  const calculateAdjacencyBonus = (hex) => {
    if (!hex.tile || hex.tile.type !== "district") return 0;

    const tileData = tiles.find((t) => t.name === hex.tile.name);
    if (!tileData) return 0;

    const adjacentHexes = getAdjacentHexes(hex);
    let bonus = 0;

    adjacentHexes.forEach((adjacentHex) => {
      if (!adjacentHex.tile) return;

      const adjacentTileName = adjacentHex.tile.name;

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
      { q: 1, r: 0 },
      { q: 1, r: -1 },
      { q: 0, r: -1 },
      { q: -1, r: 0 },
      { q: -1, r: 1 },
      { q: 0, r: 1 },
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

  const handleHexClick = (hex) => {
    onHexClick(hex.id, { q: hex.q, r: hex.r, s: hex.s });
  };

  const updateHexTile = (hexId, tileData) => {
    setHexagons((prev) => {
      return prev.map((hex) =>
        hex.id === hexId ? { ...hex, tile: tileData } : hex
      );
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      updateHexTile,
    }),
    []
  );

  const size = 30;
  const padding = 50;
  const maxCoord = radius * size * 2;
  const svgWidth = maxCoord + padding * 2;
  const svgHeight = maxCoord + padding * 2;

  return (
    <div className="w-full flex justify-center items-center bg-gray-50 rounded-lg">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="max-w-full max-h-full"
      >
        <defs>
          {hexagons
            .filter((hex) => hex.tile)
            .map((hex) => {
              const imagePath = getImagePath(hex.tile.name);
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
                    x="0"
                    y="0"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              );
            })
            .filter(Boolean)}
        </defs>

        {hexagons.map((hex) => {
          const pixel = hexToPixel(hex, size);
          const centerX = pixel.x + svgWidth / 2;
          const centerY = pixel.y + svgHeight / 2;
          const path = generateHexPath(centerX, centerY, size);
          const imagePath = hex.tile ? getImagePath(hex.tile.name) : null;
          const adjacencyBonus = calculateAdjacencyBonus(hex);

          return (
            <g key={hex.id}>
              {/* Hexagon */}
              <path
                d={path}
                fill={
                  hex.tile && imagePath
                    ? `url(#pattern-${hex.id.replace(",", "-")})`
                    : hex.tile
                    ? "#10b981"
                    : "#e5e7eb"
                }
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => handleHexClick(hex)}
              />

              {/* Tile name text */}
              {hex.tile && !imagePath && (
                <text
                  x={centerX}
                  y={centerY - 5}
                  textAnchor="middle"
                  fontSize="8"
                  fill="white"
                  fontWeight="bold"
                >
                  {hex.tile.name.length > 10
                    ? hex.tile.name.substring(0, 10) + "..."
                    : hex.tile.name}
                </text>
              )}

              {/* Adjacency bonus for districts */}
              {hex.tile && hex.tile.type === "district" && (
                <g>
                  <rect
                    x={centerX - 15}
                    y={centerY + 8}
                    width="30"
                    height="14"
                    fill="rgba(0, 0, 0, 0.8)"
                    rx="2"
                  />
                  <text
                    x={centerX}
                    y={centerY + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fill="gold"
                    fontWeight="bold"
                  >
                    +{adjacencyBonus}
                  </text>
                </g>
              )}

              {/* Coordinates for debugging */}
              <text
                x={centerX}
                y={centerY + (hex.tile ? 30 : 5)}
                textAnchor="middle"
                fontSize="6"
                fill="#666"
              >
                {hex.q},{hex.r}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

CustomHexGrid.displayName = "CustomHexGrid";

export default CustomHexGrid;
