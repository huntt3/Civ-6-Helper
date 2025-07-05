import React, { useEffect, useState } from "react";
import "./Tech.css";
import "./TechModal.css";

// TechCard component for each tech
const TechCard = ({ tech, onResearch, onBoostToggle, onShowDetails }) => (
  <div
    className={`tech-card${tech.researched ? " researched" : ""}`}
    tabIndex={0}
    aria-label={`Show details for ${tech.name}`}
    role="button"
    aria-pressed={!!tech.researched}
    onClick={e => {
      // Don't toggle researched if clicking the details button or checkbox
      if (
        e.target.classList.contains("details-btn") ||
        e.target.classList.contains("boost-checkbox")
      ) return;
      onResearch(tech.name);
    }}
    onKeyDown={(e) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        !(document.activeElement.classList.contains("details-btn") || document.activeElement.classList.contains("boost-checkbox"))
      ) {
        onResearch(tech.name);
      }
    }}
    style={{ cursor: "pointer" }}
  >
    <span className="tech-card-title">{tech.name}</span>
    <label style={{ display: "block", marginTop: "0.5rem", fontSize: "0.95rem" }}>
      <input
        type="checkbox"
        className="boost-checkbox"
        checked={!!tech.boosted}
        onChange={e => { e.stopPropagation(); onBoostToggle(tech.name); }}
        onClick={e => e.stopPropagation()}
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
      onClick={e => { e.stopPropagation(); onShowDetails(tech); }}
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
    <div className="tech-modal-overlay" role="dialog" aria-modal="true" aria-label={`Details for ${tech.name}`}> 
      <div className="tech-modal">
        <button className="tech-modal-close" onClick={onClose} aria-label="Close details">×</button>
        <div className="tech-modal-title">{tech.name}</div>
        <div className="tech-modal-section">
          <strong>Cost:</strong> {tech.baseCost} <img src="../yieldImg/science.webp" alt="science" style={{ height: "1em", verticalAlign: "middle" }} />
        </div>
        <div className="tech-modal-section">
          <strong>Boosted:</strong> {tech.boosted ? "Yes" : "No"}
        </div>
        <div className="tech-modal-section">
          <strong>Prerequisites:</strong>
          <div className="tech-modal-prereqs">
            {tech.prerequisites && tech.prerequisites.length > 0 ? (
              <ul>
                {tech.prerequisites.map((pr, i) => <li key={i}>{pr}</li>)}
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
        const merged = (data.Techs || []).map(t => {
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
        setTechs((prev) => prev.map(t => ({ ...t, ...((techState && techState[t.name]) || {}) })));
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
    techs.forEach(t => {
      state[t.name] = {
        researched: !!t.researched,
        boosted: !!t.boosted
      };
    });
    localStorage.setItem("civ6_tech_state", JSON.stringify(state));
  }, [techs]);
  // Handler to reset all techs
  const handleReset = () => {
    setTechs((prev) => prev.map(t => ({ ...t, researched: false, boosted: false })));
    // Also clear localStorage for immediate effect
    const state = {};
    techs.forEach(t => {
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
      prev.map((t) =>
        t.name === name ? { ...t, boosted: !t.boosted } : t
      )
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

  return (
    <section className="tech-carousel" aria-label="Technologies" tabIndex="0">
      <header style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <h2 className="tech-carousel-title" style={{ margin: 0 }}>Technologies</h2>
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
            cursor: "pointer"
          }}
        >
          Refresh
        </button>
      </header>
      <div className="tech-carousel-grid">
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
