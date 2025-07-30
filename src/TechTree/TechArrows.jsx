import React from "react";

const TechArrows = ({
  arrowData,
  columns,
  rows,
  cardWidth,
  cardHeight,
  gap,
}) => (
  <svg
    className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    width={columns * (cardWidth + gap)}
    height={rows * (cardHeight + gap)}
  >
    {arrowData.map((arrow, i) => (
      <g key={i}>
        <line
          x1={arrow.x1}
          y1={arrow.y1}
          x2={arrow.x2}
          y2={arrow.y2}
          stroke="var(--tech-arrow-color)"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
      </g>
    ))}
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="10"
        refY="3.5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="var(--tech-arrow-color)" />
      </marker>
    </defs>
  </svg>
);

export default TechArrows;
