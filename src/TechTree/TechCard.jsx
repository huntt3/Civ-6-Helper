import React from "react";

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
  // Handle empty cards
  if (!tech || !tech.name) {
    return (
      <div
        className="bg-transparent shadow-none border-none cursor-default"
        aria-hidden="true"
      ></div>
    );
  }

  // Get CSS classes for Tailwind
  const getCardClasses = () => {
    let classes =
      "rounded-2xl min-w-0 min-h-0 h-full w-full flex flex-col items-center justify-center text-lg shadow-lg cursor-pointer border-2 border-gray-300 text-gray-800 transition-all duration-200 relative z-10 hover:shadow-xl hover:border-green-500";

    if (tech.researched) {
      classes +=
        " !bg-gray-500 text-white grayscale brightness-75 border-gray-600 cursor-not-allowed hover:shadow-lg hover:border-gray-600";
    } else {
      const canResearch = allPrereqsResearched(tech, allTechs);
      if (tech.boosted && !canResearch) {
        classes +=
          techCivic === "Tech"
            ? " !bg-yellow-600 text-white"
            : " !bg-purple-600 text-white";
      } else if (tech.boosted && canResearch) {
        classes +=
          techCivic === "Tech"
            ? " !bg-green-500 text-white"
            : " !bg-blue-500 text-white";
      } else if (!tech.boosted && !canResearch) {
        classes +=
          techCivic === "Tech"
            ? " !bg-red-400 text-gray-800"
            : " !bg-pink-400 text-gray-800";
      } else if (!tech.boosted && canResearch) {
        classes +=
          techCivic === "Tech"
            ? " !bg-blue-400 text-white"
            : " !bg-indigo-400 text-white";
      }
    }

    if (hoverClass) {
      classes += ` ${hoverClass}`;
    }

    return classes;
  };

  return (
    <div
      className={getCardClasses()}
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
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      onFocus={onHover}
      onBlur={onUnhover}
    >
      <span
        className="font-semibold mb-1 text-base text-white tracking-wide"
        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
      >
        {tech.name}
      </span>
      <label className="block mt-2 text-sm">
        <input
          type="checkbox"
          className="boost-checkbox mr-1"
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
        className="details-btn mt-1 px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
