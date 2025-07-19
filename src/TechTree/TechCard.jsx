import React from "react";
import "./TechTree.css";

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
  hoverClass = "",
  onHover,
  onUnhover,
  techCivic = "Tech", // Add this prop, default to "Tech"
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
  if (hoverClass) {
    cardClass += ` ${hoverClass}`;
  }

  // Set background color based on techCivic and state
  const getBackgroundColor = () => {
    if (tech.researched) {
      // Use a different color for researched techs and civics
      return techCivic === "Tech"
        ? "var(--tech-card-researched-color)"
        : "var(--civic-card-researched-color)";
    }
    const canResearch = allPrereqsResearched(tech, allTechs);
    if (tech.boosted && !canResearch) {
      // Boosted but cannot research yet
      return techCivic === "Tech"
        ? "var(--tech-card-boosted-cannot-research-color)"
        : "var(--civic-card-boosted-cannot-research-color)";
    } else if (tech.boosted && canResearch) {
      // Boosted and can research
      return techCivic === "Tech"
        ? "var(--tech-card-boosted-can-research-color)"
        : "var(--civic-card-boosted-can-research-color)";
    } else if (!tech.boosted && !canResearch) {
      // Not boosted and cannot research yet
      return techCivic === "Tech"
        ? "var(--tech-card-no-boost-cannot-research-color)"
        : "var(--civic-card-no-boost-cannot-research-color)";
    } else if (!tech.boosted && canResearch) {
      // Not boosted but can research
      return techCivic === "Tech"
        ? "var(--tech-card-no-boost-can-research-color)"
        : "var(--civic-card-no-boost-can-research-color)";
    }
    // Default color if none of the above
    return "";
  };

  const background = getBackgroundColor();

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
      style={{ cursor: "pointer", background }}
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      onFocus={onHover}
      onBlur={onUnhover}
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
