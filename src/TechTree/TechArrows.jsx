import React from "react";
import "./TechTree.css";

const TechArrows = ({
  arrowData,
  columns,
  rows,
  cardWidth,
  cardHeight,
  gap,
}) => (
  <svg
    className="tech-arrows-svg"
    width={columns * (cardWidth + gap)}
    height={rows * (cardHeight + gap)}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 0,
      pointerEvents: "none",
    }}
  >
    {arrowData.map((arrow, i) => (
      <g key={i}>
        <line
          x1={arrow.x1}
          y1={arrow.y1}
          x2={arrow.x2}
          y2={arrow.y2}
          stroke="#1976d2"
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
        <polygon points="0 0, 10 3.5, 0 7" fill="#1976d2" />
      </marker>
    </defs>
  </svg>
);

export default TechArrows;
