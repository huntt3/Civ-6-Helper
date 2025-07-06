import React, { useEffect, useState } from "react";
import CivicsCard from "./CivicCard";
import "../TechTree/TechCarousel.css";

const CivicsCarousel = () => {
  const [civics, setCivics] = useState([]);
  const [modalCivic, setModalCivic] = useState(null);
  const [hoveredCivic, setHoveredCivic] = useState(null);

  useEffect(() => {
    fetch("/jsonFiles/TechsAndCivics.json")
      .then((res) => res.json())
      .then((data) => {
        const civicsList = (data.Techs || [])
          .concat(data.Civics || [])
          .filter((c) => c.techCivic === "Civic");
        const saved = localStorage.getItem("civ6_civics_state");
        let civicState = {};
        if (saved) {
          try {
            civicState = JSON.parse(saved);
          } catch {}
        }
        const merged = civicsList.map((c) => {
          const state = civicState[c.name] || {};
          return { ...c, ...state };
        });
        setCivics(merged);
      });
    const handleStorage = (e) => {
      if (e.key === "civ6_civics_state") {
        const saved = e.newValue;
        let civicState = {};
        if (saved) {
          try {
            civicState = JSON.parse(saved);
          } catch {}
        }
        setCivics((prev) =>
          prev.map((c) => ({
            ...c,
            ...((civicState && civicState[c.name]) || {}),
          }))
        );
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!civics.length) return;
    const state = {};
    civics.forEach((c) => {
      state[c.name] = {
        researched: !!c.researched,
        boosted: !!c.boosted,
      };
    });
    localStorage.setItem("civ6_civics_state", JSON.stringify(state));
  }, [civics]);

  const handleReset = () => {
    setCivics((prev) =>
      prev.map((c) => ({ ...c, researched: false, boosted: false }))
    );
    const state = {};
    civics.forEach((c) => {
      state[c.name] = { researched: false, boosted: false };
    });
    localStorage.setItem("civ6_civics_state", JSON.stringify(state));
  };

  const handleResearch = (name) => {
    setCivics((prev) =>
      prev.map((c) =>
        c.name === name ? { ...c, researched: !c.researched } : c
      )
    );
  };

  const handleBoostToggle = (name) => {
    setCivics((prev) =>
      prev.map((c) => (c.name === name ? { ...c, boosted: !c.boosted } : c))
    );
  };

  const handleShowDetails = (civic) => {
    setModalCivic(civic);
  };

  const handleCloseModal = () => {
    setModalCivic(null);
  };

  // Highlight logic
  let boostsSet = new Set();
  let boostedBySet = new Set();
  if (hoveredCivic) {
    boostsSet = new Set(hoveredCivic.boostPrerequisites || []);
    boostedBySet = new Set(
      civics
        .filter((c) => (c.boostPrerequisites || []).includes(hoveredCivic.name))
        .map((c) => c.name)
    );
  }

  // Layout: 20 columns, 8 rows (same as tech tree)
  const columns = 20;
  const rows = 8;
  const grid = Array.from({ length: rows }, () => Array(columns).fill(null));
  civics.forEach((civic) => {
    if (
      typeof civic.column === "number" &&
      typeof civic.row === "number" &&
      civic.column >= 0 &&
      civic.column < columns &&
      civic.row >= 0 &&
      civic.row < rows
    ) {
      grid[civic.row][civic.column] = civic;
    }
  });

  return (
    <section
      className="tech-carousel"
      aria-label="Civics"
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
          Civics
        </h2>
        <button
          type="button"
          aria-label="Reset all researched and boosted civics"
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
      <div className="tech-carousel-grid" style={{ position: "relative" }}>
        {grid.flat().map((civic, idx) => {
          if (!civic) {
            return (
              <div
                key={idx}
                className="tech-card tech-card-empty"
                aria-hidden="true"
              ></div>
            );
          }
          let extraClass = "";
          if (hoveredCivic && civic.name === hoveredCivic.name) {
            extraClass = "tech-card-hovered";
          } else if (hoveredCivic && boostsSet.has(civic.name)) {
            extraClass = "tech-card-boosts-hovered";
          } else if (hoveredCivic && boostedBySet.has(civic.name)) {
            extraClass = "tech-card-boosted-by-hovered";
          }
          return (
            <CivicsCard
              key={civic.name}
              civic={civic}
              allCivics={civics}
              onResearch={handleResearch}
              onBoostToggle={handleBoostToggle}
              onShowDetails={handleShowDetails}
              hoverClass={extraClass}
              onHover={() => setHoveredCivic(civic)}
              onUnhover={() => setHoveredCivic(null)}
            />
          );
        })}
      </div>
      {/* Modal for details can be added here if needed */}
    </section>
  );
};

export default CivicsCarousel;
