import React from "react";

import { useId } from "react";

const TechArrows = ({
  arrowData,
  columns,
  rows,
  cardWidth,
  cardHeight,
  gap,
  zoom = 1,
}) => {
  const markerId = useId();

  // Scale arrows naturally with zoom level
  // When zoomed out, arrows get smaller; when zoomed in, arrows get larger
  const baseStrokeWidth = 3;
  const baseMarkerSize = 10;
  const baseMarkerHeight = 7;

  const strokeWidth = baseStrokeWidth;
  const markerSize = baseMarkerSize;
  const markerHeight = baseMarkerHeight;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      width={columns * (cardWidth + gap)}
      height={rows * (cardHeight + gap)}
    >
      {arrowData.map((arrow, i) =>
        arrow.x1 != null &&
        arrow.y1 != null &&
        arrow.x2 != null &&
        arrow.y2 != null ? (
          <g key={i}>
            <line
              x1={arrow.x1}
              y1={arrow.y1}
              x2={arrow.x2}
              y2={arrow.y2}
              stroke="#1434a4"
              strokeWidth={strokeWidth}
              markerEnd={`url(#${markerId})`}
            />
          </g>
        ) : null
      )}
      <defs>
        <marker
          id={markerId}
          markerWidth={markerSize}
          markerHeight={markerHeight}
          refX={markerSize}
          refY={markerHeight / 2}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon
            points={`0 0, ${markerSize} ${markerHeight / 2}, 0 ${markerHeight}`}
            fill="#1434a4"
          />
        </marker>
      </defs>
    </svg>
  );
};

export default TechArrows;
