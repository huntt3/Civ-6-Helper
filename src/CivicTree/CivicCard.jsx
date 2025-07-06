import React from "react";
import "../TechTree/TechCard.css";

// Helper to determine if all prerequisites are researched
const allPrereqsResearched = (civic, allCivics) => {
  if (!civic.prerequisites || civic.prerequisites.length === 0) return true;
  return civic.prerequisites.every((pr) => {
    const prereqCivic = allCivics.find((t) => t.name === pr);
    return prereqCivic && prereqCivic.researched;
  });
};

const CivicsCard = ({
  civic,
  onResearch,
  onBoostToggle,
  onShowDetails,
  allCivics,
  hoverClass = "",
  onHover,
  onUnhover,
}) => {
  let cardClass = "tech-card";
  if (civic.researched) {
    cardClass += " researched";
  } else {
    const canResearch = allPrereqsResearched(civic, allCivics);
    if (civic.boosted) {
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

  return (
    <div
      className={cardClass}
      tabIndex={0}
      aria-label={`Show details for ${civic.name}`}
      role="button"
      aria-pressed={!!civic.researched}
      onClick={(e) => {
        if (
          e.target.classList.contains("details-btn") ||
          e.target.classList.contains("boost-checkbox")
        )
          return;
        onResearch(civic.name);
      }}
      onKeyDown={(e) => {
        if (
          (e.key === "Enter" || e.key === " ") &&
          !(
            document.activeElement.classList.contains("details-btn") ||
            document.activeElement.classList.contains("boost-checkbox")
          )
        ) {
          onResearch(civic.name);
        }
      }}
      style={{ cursor: "pointer" }}
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      onFocus={onHover}
      onBlur={onUnhover}
    >
      <span className="tech-card-title">{civic.name}</span>
      <label
        style={{ display: "block", marginTop: "0.5rem", fontSize: "0.95rem" }}
      >
        <input
          type="checkbox"
          className="boost-checkbox"
          checked={!!civic.boosted}
          onChange={(e) => {
            e.stopPropagation();
            onBoostToggle(civic.name);
          }}
          onClick={(e) => e.stopPropagation()}
          aria-checked={!!civic.boosted}
          aria-label={`Toggle boost for ${civic.name}`}
          disabled={false}
        />
        Boosted
      </label>
      <button
        className="details-btn"
        type="button"
        tabIndex={0}
        aria-label={`Show details for ${civic.name}`}
        onClick={(e) => {
          e.stopPropagation();
          onShowDetails(civic);
        }}
        disabled={false}
      >
        Details
      </button>
    </div>
  );
};

export default CivicsCard;
