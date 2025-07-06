import React from "react";
import "./TechCard.css";

const TechCard = ({ tech, onResearch, onBoostToggle, onShowDetails }) => (
  <div
    className={`tech-card${tech.researched ? " researched" : ""}`}
    tabIndex={0}
    aria-label={`Show details for ${tech.name}`}
    role="button"
    aria-pressed={!!tech.researched}
    onClick={(e) => {
      if (
        e.target.classList.contains("details-btn") ||
        e.target.classList.contains("boost-checkbox")
      )
        return;
      onResearch(tech.name);
    }}
    onKeyDown={(e) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        !(
          document.activeElement.classList.contains("details-btn") ||
          document.activeElement.classList.contains("boost-checkbox")
        )
      ) {
        onResearch(tech.name);
      }
    }}
    style={{ cursor: "pointer" }}
  >
    <span className="tech-card-title">{tech.name}</span>
    <label
      style={{ display: "block", marginTop: "0.5rem", fontSize: "0.95rem" }}
    >
      <input
        type="checkbox"
        className="boost-checkbox"
        checked={!!tech.boosted}
        onChange={(e) => {
          e.stopPropagation();
          onBoostToggle(tech.name);
        }}
        onClick={(e) => e.stopPropagation()}
        aria-checked={!!tech.boosted}
        aria-label={`Toggle boost for ${tech.name}`}
        disabled={false}
      />
      Boosted
    </label>
    <button
      className="details-btn"
      type="button"
      tabIndex={0}
      aria-label={`Show details for ${tech.name}`}
      onClick={(e) => {
        e.stopPropagation();
        onShowDetails(tech);
      }}
      disabled={false}
    >
      Details
    </button>
  </div>
);

export default TechCard;
