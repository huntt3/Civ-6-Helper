import React, { useEffect, useState } from "react";
import "./Tech.css";
import "./TechModal.css";
import "./TechArrows.css";

// TechCard component for each tech
const TechCard = ({ tech, onResearch, onBoostToggle, onShowDetails }) => (
  <div
    className={`tech-card${tech.researched ? " researched" : ""}`}
    tabIndex={0}
    aria-label={`Show details for ${tech.name}`}
    role="button"
    aria-pressed={!!tech.researched}
    onClick={(e) => {
      // Don't toggle researched if clicking the details button or checkbox
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

// Modal for tech details
const TechModal = ({ tech, onClose }) => {
  if (!tech) return null;
  return (
    <div
      className="tech-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${tech.name}`}
    >
      <div className="tech-modal">
        <button
          className="tech-modal-close"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
        <div className="tech-modal-title">{tech.name}</div>
        <div className="tech-modal-section">
          <strong>Cost:</strong> {tech.baseCost}{" "}
          <img
            src="../yieldImg/science.webp"
            alt="science"
            style={{ height: "1em", verticalAlign: "middle" }}
          />
        </div>
        <div className="tech-modal-section">
          <strong>Boosted:</strong> {tech.boosted ? "Yes" : "No"}
        </div>
        <div className="tech-modal-section">
          <strong>Prerequisites:</strong>
          <div className="tech-modal-prereqs">
            {tech.prerequisites && tech.prerequisites.length > 0 ? (
              <ul>
                {tech.prerequisites.map((pr, i) => (
                  <li key={i}>{pr}</li>
                ))}
              </ul>
            ) : (
              <span>None</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// TechCarousel component
const TechCarousel = () => {
  const [techs, setTechs] = useState([]);
  const [modalTech, setModalTech] = useState(null);

  // Load techs and localStorage state on mount
  useEffect(() => {
    fetch("/jsonFiles/Techs.json")
      .then((res) => res.json())
      .then((data) => {
        // Try to load researched/boosted from localStorage
        const saved = localStorage.getItem("civ6_tech_state");
        let techState = {};
        if (saved) {
          try {
            techState = JSON.parse(saved);
          } catch {}
        }
        // Merge state into loaded techs
        const merged = (data.Techs || []).map((t) => {
          const state = techState[t.name] || {};
          return { ...t, ...state };
        });
        setTechs(merged);
      });
    // Listen for storage changes (other tabs)
    const handleStorage = (e) => {
      if (e.key === "civ6_tech_state") {
        const saved = e.newValue;
        let techState = {};
        if (saved) {
          try {
            techState = JSON.parse(saved);
          } catch {}
        }
        setTechs((prev) =>
          prev.map((t) => ({
            ...t,
            ...((techState && techState[t.name]) || {}),
          }))
        );
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Save researched/boosted state to localStorage whenever techs change
  useEffect(() => {
    // Only save researched/boosted, not the whole tech object
    if (!techs.length) return;
    const state = {};
    techs.forEach((t) => {
      state[t.name] = {
        researched: !!t.researched,
        boosted: !!t.boosted,
      };
    });
    localStorage.setItem("civ6_tech_state", JSON.stringify(state));
  }, [techs]);
  // Handler to reset all techs
  const handleReset = () => {
    setTechs((prev) =>
      prev.map((t) => ({ ...t, researched: false, boosted: false }))
    );
    // Also clear localStorage for immediate effect
    const state = {};
    techs.forEach((t) => {
      state[t.name] = { researched: false, boosted: false };
    });
    localStorage.setItem("civ6_tech_state", JSON.stringify(state));
  };

  // Handler to toggle researched
  const handleResearch = (name) => {
    setTechs((prev) =>
      prev.map((t) =>
        t.name === name ? { ...t, researched: !t.researched } : t
      )
    );
  };

  // Handler to toggle boosted
  const handleBoostToggle = (name) => {
    setTechs((prev) =>
      prev.map((t) => (t.name === name ? { ...t, boosted: !t.boosted } : t))
    );
  };

  // Handler to show modal
  const handleShowDetails = (tech) => {
    setModalTech(tech);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setModalTech(null);
  };

  // Create a 20x8 grid (columns x rows)
  const columns = 20;
  const rows = 8;
  // Fill grid with nulls
  const grid = Array.from({ length: rows }, () => Array(columns).fill(null));
  // Place techs in their grid positions
  techs.forEach((tech) => {
    if (
      typeof tech.column === "number" &&
      typeof tech.row === "number" &&
      tech.column >= 0 &&
      tech.column < columns &&
      tech.row >= 0 &&
      tech.row < rows
    ) {
      grid[tech.row][tech.column] = tech;
    }
  });

  // Calculate arrow lines between techs and their prerequisites
  const arrowData = [];
  // Card size and gap must match CSS grid
  const cardWidth = 120; // px, from grid-template-columns
  const cardHeight = 100; // px, from grid-template-rows
  const gap = 40; // px, from .tech-carousel-grid gap (2.5rem)
  // For each tech, draw arrows from each prerequisite
  techs.forEach((tech) => {
    if (!tech.prerequisites || !Array.isArray(tech.prerequisites)) return;
    tech.prerequisites.forEach((prereqName) => {
      const prereq = techs.find((t) => t.name === prereqName);
      if (!prereq) return;
      // Get grid positions
      const fromCol = prereq.column;
      const fromRow = prereq.row;
      const toCol = tech.column;
      const toRow = tech.row;
      if (
        typeof fromCol !== "number" ||
        typeof fromRow !== "number" ||
        typeof toCol !== "number" ||
        typeof toRow !== "number"
      )
        return;
      // Calculate SVG coordinates (right edge center of prereq to left edge center of tech)
      const x1 = fromCol * (cardWidth + gap) + cardWidth; // right edge of prereq
      // Add vertical offset for grid gap (gap/2) to center arrows in the cell+gap area
      const y1 = fromRow * (cardHeight + gap) + 2 * gap + cardHeight / 2;
      const x2 = toCol * (cardWidth + gap); // left edge of tech
      const y2 = toRow * (cardHeight + gap) + 2 * gap + cardHeight / 2;
      arrowData.push({ x1, y1, x2, y2 });
    });
  });

  return (
    <section
      className="tech-carousel"
      aria-label="Technologies"
      tabIndex="0"
      style={{ position: "relative" }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <h2 className="tech-carousel-title" style={{ margin: 0 }}>
          Technologies
        </h2>
        <button
          type="button"
          aria-label="Reset all researched and boosted techs"
          onClick={handleReset}
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "3px",
            padding: "0.3rem 0.9rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </header>
      {/* SVG arrows between techs */}
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
      <div
        className="tech-carousel-grid"
        style={{ position: "relative", zIndex: 1 }}
      >
        {grid
          .flat()
          .map((tech, idx) =>
            tech ? (
              <TechCard
                key={tech.name}
                tech={tech}
                onResearch={handleResearch}
                onBoostToggle={handleBoostToggle}
                onShowDetails={handleShowDetails}
              />
            ) : (
              <div
                key={idx}
                className="tech-card tech-card-empty"
                aria-hidden="true"
              ></div>
            )
          )}
      </div>
      <TechModal tech={modalTech} onClose={handleCloseModal} />
    </section>
  );
};

export default TechCarousel;
