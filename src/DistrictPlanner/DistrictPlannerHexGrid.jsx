import React, { useState, forwardRef, useImperativeHandle } from "react";
import { HexGrid, Layout, Hexagon } from "react-hexgrid";

const DistrictPlannerHexGrid = forwardRef(({ onHexClick }, ref) => {
  const [hexagons, setHexagons] = useState([]);

  // Generate a 7x7 hex grid centered around (0,0)
  const generateHexagons = () => {
    const hexes = [];
    for (let q = -3; q <= 3; q++) {
      for (let r = -3; r <= 3; r++) {
        if (Math.abs(q + r) <= 3) {
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

  // Initialize hexagons on first render
  React.useEffect(() => {
    setHexagons(generateHexagons());
  }, []);

  const handleHexClick = (event, source) => {
    const { q, r } = source.state;
    const hexId = `${q},${r}`;
    onHexClick(hexId, { q, r, s: -q - r });
  };

  const updateHexTile = (hexId, tileData) => {
    setHexagons((prev) =>
      prev.map((hex) => (hex.id === hexId ? { ...hex, tile: tileData } : hex))
    );
  };

  // Expose updateHexTile to parent component
  useImperativeHandle(
    ref,
    () => ({
      updateHexTile,
    }),
    []
  );

  return (
    <div className="w-full h-96 flex justify-center items-center bg-gray-50 rounded-lg">
      <HexGrid width={600} height={400} viewBox="-50 -50 100 100">
        <Layout
          size={{ x: 6, y: 6 }}
          flat={true}
          spacing={1.1}
          origin={{ x: 0, y: 0 }}
        >
          {hexagons.map((hex) => (
            <Hexagon
              key={hex.id}
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
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="2"
                  fill="white"
                  className="pointer-events-none"
                >
                  {hex.tile.name.substring(0, 8)}
                </text>
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
