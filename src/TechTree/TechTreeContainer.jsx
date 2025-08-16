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
        const savedPositions = localStorage.getItem("civ6_tech_positions");
        
        let techState = {};
        let positionState = {};
        
        if (saved) {
          try {
            techState = JSON.parse(saved);
          } catch {}
        }
        
        if (savedPositions) {
          try {
            positionState = JSON.parse(savedPositions);
          } catch {}
        }
        
        const merged = (data.Techs || []).map((t) => {
          const state = techState[t.name] || {};
          const position = positionState[t.name] || {};
          return { ...t, ...state, ...position };
        });
        setAllTechs(merged);
      });
    const handleStorage = (e) => {
      if (e.key === "civ6_tech_state" || e.key === "civ6_tech_positions") {
        const saved = localStorage.getItem("civ6_tech_state");
        const savedPositions = localStorage.getItem("civ6_tech_positions");
        
        let techState = {};
        let positionState = {};
        
        if (saved) {
          try {
            techState = JSON.parse(saved);
          } catch {}
        }
        
        if (savedPositions) {
          try {
            positionState = JSON.parse(savedPositions);
          } catch {}
        }
        
        setAllTechs((prev) =>
          prev.map((t) => ({
            ...t,
            ...((techState && techState[t.name]) || {}),
            ...((positionState && positionState[t.name]) || {}),
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

  // Store reset handlers and refs for each carousel
  const techResetRef = React.useRef(null);
  const civicResetRef = React.useRef(null);
  const techCarouselRef = React.useRef(null);
  const civicCarouselRef = React.useRef(null);

  // Callback to receive reset function from TechCarousel
  const setTechReset = (fn) => {
    techResetRef.current = fn;
  };
  const setCivicReset = (fn) => {
    civicResetRef.current = fn;
  };

  // Reset view handlers
  const handleTechResetView = () => {
    if (techCarouselRef.current && techCarouselRef.current.resetView) {
      techCarouselRef.current.resetView();
    }
    if (techResetRef.current) {
      techResetRef.current();
    }
  };

  const handleCivicResetView = () => {
    if (civicCarouselRef.current && civicCarouselRef.current.resetView) {
      civicCarouselRef.current.resetView();
    }
    if (civicResetRef.current) {
      civicResetRef.current();
    }
  };

  return (
    <>
      <CollapsibleContainer
        title="Tech Tracker"
        collapsed={techCollapsed}
        onCollapse={handleTechCollapse}
        onRefresh={handleTechResetView}
        ariaLabel="Tech Tracker"
      >
        <div className="mb-2">
          <div className="flex gap-2 justify-center items-center">
            <button
              onClick={handleTechResetView}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            >
              Reset View
            </button>
            <div className="text-xs text-gray-500">
              Scroll to zoom • Drag to pan
            </div>
          </div>
        </div>
        <TechCarousel
          ref={techCarouselRef}
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
        onRefresh={handleCivicResetView}
        ariaLabel="Civic Tracker"
      >
        <div className="mb-2">
          <div className="flex gap-2 justify-center items-center">
            <button
              onClick={handleCivicResetView}
              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
            >
              Reset View
            </button>
            <div className="text-xs text-gray-500">
              Scroll to zoom • Drag to pan
            </div>
          </div>
        </div>
        <TechCarousel
          ref={civicCarouselRef}
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
