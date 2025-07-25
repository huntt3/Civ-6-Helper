import React, { useEffect, useState } from "react";
import TechCard from "./TechCard";
import TechModal from "./TechModal";
import TechArrows from "./TechArrows";
import "./TechTree.css";

const TechCarousel = ({ rowRange, minRow = 0, onReset }) => {
  const [techs, setTechs] = useState([]);
  const [modalTech, setModalTech] = useState(null);

  useEffect(() => {
    fetch("./jsonFiles/TechsAndCivics.json")
      .then((res) => res.json())
      .then((data) => {
        const saved = localStorage.getItem("civ6_tech_state");
        let techState = {};
        if (saved) {
          try {
            techState = JSON.parse(saved);
          } catch {}
        }
        const merged = (data.Techs || []).map((t) => {
          const state = techState[t.name] || {};
          return { ...t, ...state };
        });
        setTechs(merged);
      });
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

  useEffect(() => {
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

  // Expose reset logic to parent via onReset prop using useEffect and useCallback
  React.useEffect(() => {
    if (!onReset) return;
    onReset(() => {
      setTechs((prev) =>
        prev.map((t) => ({ ...t, researched: false, boosted: false }))
      );
      const state = {};
      techs.forEach((t) => {
        state[t.name] = { researched: false, boosted: false };
      });
      localStorage.setItem("civ6_tech_state", JSON.stringify(state));
    });
    // Only run once when mounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReset]);

  const handleResearch = (name) => {
    setTechs((prev) =>
      prev.map((t) =>
        t.name === name ? { ...t, researched: !t.researched } : t
      )
    );
  };

  const handleBoostToggle = (name) => {
    setTechs((prev) =>
      prev.map((t) => (t.name === name ? { ...t, boosted: !t.boosted } : t))
    );
  };

  const handleShowDetails = (tech) => {
    setModalTech(tech);
  };

  const handleCloseModal = () => {
    setModalTech(null);
  };

  const columns = 20;
  // Filter techs by rowRange if provided
  let filteredTechs = techs;
  if (
    rowRange &&
    typeof rowRange.start === "number" &&
    typeof rowRange.end === "number"
  ) {
    filteredTechs = techs.filter(
      (t) =>
        typeof t.row === "number" &&
        t.row >= rowRange.start &&
        t.row <= rowRange.end
    );
  }
  // Find the max row value in the filtered data to ensure all rows are shown
  const maxRow = Math.max(
    ...filteredTechs.map((t) => (typeof t.row === "number" ? t.row : minRow)),
    minRow
  );
  const rows = Math.max(1, maxRow - minRow + 1);
  const grid = Array.from({ length: rows }, () => Array(columns).fill(null));
  filteredTechs.forEach((tech) => {
    if (
      typeof tech.column === "number" &&
      typeof tech.row === "number" &&
      tech.column >= 0 &&
      tech.column < columns &&
      tech.row >= minRow &&
      tech.row <= maxRow
    ) {
      grid[tech.row - minRow][tech.column] = tech;
    }
  });

  const arrowData = [];
  const cardWidth = 120;
  const cardHeight = 100;
  const gap = 40;
  techs.forEach((tech) => {
    if (!tech.prerequisites || !Array.isArray(tech.prerequisites)) return;
    tech.prerequisites.forEach((prereqName) => {
      const prereq = filteredTechs.find((t) => t.name === prereqName);
      if (!prereq) return;
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
      if (
        fromCol >= 0 &&
        fromCol < columns &&
        toCol >= 0 &&
        toCol < columns &&
        fromRow >= minRow &&
        fromRow <= maxRow &&
        toRow >= minRow &&
        toRow <= maxRow
      ) {
        const x1 = fromCol * (cardWidth + gap) + cardWidth;
        const y1 = (fromRow - minRow) * (cardHeight + gap) + cardHeight / 1.5;
        const x2 = toCol * (cardWidth + gap);
        const y2 = (toRow - minRow) * (cardHeight + gap) + cardHeight / 1.5;
        arrowData.push({ x1, y1, x2, y2 });
      }
    });
  });

  // Hover logic for highlighting
  const [hoveredTech, setHoveredTech] = useState(null);

  // Find boostPrerequisites for hovered card
  let boostsSet = new Set();
  let boostedBySet = new Set();
  if (hoveredTech) {
    // Cards that this hovered card boosts
    boostsSet = new Set(hoveredTech.boostPrerequisites || []);
    // Cards that list this hovered card in their boostPrerequisites
    boostedBySet = new Set(
      techs
        .filter((t) => (t.boostPrerequisites || []).includes(hoveredTech.name))
        .map((t) => t.name)
    );
  }

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
      </header>
      <div className="tech-carousel-grid" style={{ position: "relative" }}>
        <TechArrows
          arrowData={arrowData}
          columns={columns}
          rows={rows}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          gap={gap}
        />
        {grid.flat().map((tech, idx) => {
          if (!tech) {
            return (
              <div
                key={idx}
                className="tech-card tech-card-empty"
                aria-hidden="true"
              ></div>
            );
          }
          let extraClass = "";
          if (hoveredTech && tech.name === hoveredTech.name) {
            if (tech.techCivic === "Tech") {
              extraClass = "tech-card-hovered";
            } else {
              extraClass = "civic-card-hovered";
            }
          } else if (hoveredTech && boostsSet.has(tech.name)) {
            if (tech.techCivic === "Tech") {
              extraClass = "tech-card-boosts-hovered";
            } else {
              extraClass = "civic-card-boosts-hovered";
            }
          } else if (hoveredTech && boostedBySet.has(tech.name)) {
            if (tech.techCivic === "Tech") {
              extraClass = "tech-card-boosted-by-hovered";
            } else {
              extraClass = "civic-card-boosted-by-hovered";
            }
          }
          return (
            <TechCard
              key={tech.name}
              tech={tech}
              allTechs={filteredTechs}
              onResearch={handleResearch}
              onBoostToggle={handleBoostToggle}
              onShowDetails={handleShowDetails}
              hoverClass={extraClass}
              onHover={() => setHoveredTech(tech)}
              onUnhover={() => setHoveredTech(null)}
            />
          );
        })}
      </div>
      <TechModal tech={modalTech} onClose={handleCloseModal} />
    </section>
  );
};

export default TechCarousel;
