import React, { useState, forwardRef, useImperativeHandle } from "react";
import { HexGrid, Layout, Hexagon, Text } from "react-hexgrid";

const DistrictPlannerHexGrid = forwardRef(({ onHexClick, radius = 3 }, ref) => {
  const [hexagons, setHexagons] = useState([]);

  // Generate a hex grid centered around (0,0) with configurable radius
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
            tile: null, // Will store selected tile data
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

  const handleHexClick = (event, source) => {
    let q, r, s;
    if (source.props) {
      q = source.props.q;
      r = source.props.r;
      s = source.props.s;
    } else {
      q = source.q;
      r = source.r;
      s = source.s;
    }

    const hexId = `${q},${r}`;

    if (q !== undefined && r !== undefined) {
      onHexClick(hexId, { q, r, s });
    }
  };

  const updateHexTile = (hexId, tileData) => {
    setHexagons((prev) => {
      const updated = prev.map((hex) =>
        hex.id === hexId ? { ...hex, tile: tileData } : hex
      );
      return updated;
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      updateHexTile,
    }),
    []
  );

  return (
    <div
      className="w-full flex justify-center items-center bg-gray-50 rounded-lg relative"
      style={{ height: `${Math.max(400, radius * 80 + 200)}px` }}
    >
      <HexGrid
        width={Math.max(600, radius * 120 + 200)}
        height={Math.max(400, radius * 80 + 200)}
        viewBox={`-${radius * 15 + 35} -${radius * 15 + 35} ${
          (radius * 15 + 35) * 2
        } ${(radius * 15 + 35) * 2}`}
      >
        <Layout
          size={{ x: 6, y: 6 }}
          flat={true}
          spacing={1.1}
          origin={{ x: 0, y: 0 }}
        >
          {hexagons.map((hex) => (
            <Hexagon
              key={`${hex.id}-${hex.tile ? hex.tile.name : "empty"}`}
              q={hex.q}
              r={hex.r}
              s={hex.s}
              className="hex-tile cursor-pointer hover:opacity-75 transition-opacity"
              fill={hex.tile ? "#10b981" : "#e5e7eb"}
              stroke="#374151"
              strokeWidth={0.5}
              onClick={handleHexClick}
            >
              {hex.tile && (
                <Text
                  className="hex-text"
                  fill="white"
                  fontSize="0.08em"
                  fontWeight="bold"
                >
                  {hex.tile.name}
                </Text>
              )}
            </Hexagon>
          ))}
        </Layout>
      </HexGrid>
    </div>
  );
});

DistrictPlannerHexGrid.displayName = "DistrictPlannerHexGrid";

export default DistrictPlannerHexGrid;
