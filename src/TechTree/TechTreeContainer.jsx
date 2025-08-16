import React, { useState, useEffect } from "react";
import TechCarousel from "./TechCarousel";
import CollapsibleContainer from "../Templates/CollapsibleContainer";

// TechTreeContainer manages the collapsed state for the CollapsibleContainer
const TechTreeContainer = () => {
  // State to track if the containers are collapsed (start collapsed for performance)
  const [techCollapsed, setTechCollapsed] = useState(true);
  const [civicCollapsed, setCivicCollapsed] = useState(true);

  // Shared hover state for cross-container highlighting
  const [hoveredTech, setHoveredTech] = useState(null);

  // Shared techs state for cross-container boost relationships
  const [allTechs, setAllTechs] = useState([]);

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
        setAllTechs(merged);
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
        setAllTechs((prev) =>
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

  const handleTechCollapse = () => {
    setTechCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const handleCivicCollapse = () => {
    setCivicCollapsed((prevCollapsed) => !prevCollapsed);
  };

  // Store reset handlers for each carousel using refs
  const techResetRef = React.useRef(null);
  const civicResetRef = React.useRef(null);

  // Callback to receive reset function from TechCarousel
  const setTechReset = (fn) => {
    techResetRef.current = fn;
  };
  const setCivicReset = (fn) => {
    civicResetRef.current = fn;
  };

  return (
    <>
      <CollapsibleContainer
        title="Tech Tracker"
        collapsed={techCollapsed}
        onCollapse={handleTechCollapse}
        onRefresh={() => techResetRef.current && techResetRef.current()}
        ariaLabel="Tech Tracker"
      >
        <TechCarousel
          rowRange={{ start: 0, end: 7 }}
          minRow={0}
          onReset={setTechReset}
          allTechs={allTechs}
          setAllTechs={setAllTechs}
          hoveredTech={hoveredTech}
          setHoveredTech={setHoveredTech}
        />
      </CollapsibleContainer>
      <CollapsibleContainer
        title="Civic Tracker"
        collapsed={civicCollapsed}
        onCollapse={handleCivicCollapse}
        onRefresh={() => civicResetRef.current && civicResetRef.current()}
        ariaLabel="Civic Tracker"
      >
        <TechCarousel
          rowRange={{ start: 10, end: 16 }}
          minRow={10}
          onReset={setCivicReset}
          allTechs={allTechs}
          setAllTechs={setAllTechs}
          hoveredTech={hoveredTech}
          setHoveredTech={setHoveredTech}
        />
      </CollapsibleContainer>
    </>
  );
};

export default TechTreeContainer;
