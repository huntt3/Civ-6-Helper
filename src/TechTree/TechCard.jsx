import React from "react";
import "./TechCard.css";

// Helper to determine if all prerequisites are researched
const allPrereqsResearched = (tech, allTechs) => {
  if (!tech.prerequisites || tech.prerequisites.length === 0) return true;
  return tech.prerequisites.every((pr) => {
    const prereqTech = allTechs.find((t) => t.name === pr);
    return prereqTech && prereqTech.researched;
  });
};

const TechCard = ({
  tech,
  onResearch,
  onBoostToggle,
  onShowDetails,
  allTechs,
}) => {
  // Figure out the correct class for the tech card
  let cardClass = "tech-card";
  if (tech.researched) {
    cardClass += " researched";
  } else {
    const canResearch = allPrereqsResearched(tech, allTechs);
    if (tech.boosted) {
      cardClass += " boosted";
      cardClass += canResearch ? " can-research" : " cannot-research";
    } else {
      cardClass += " no-boost";
      cardClass += canResearch ? " can-research" : " cannot-research";
    }
  }

  return (
    <div
      className={cardClass}
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
};

export default TechCard;
