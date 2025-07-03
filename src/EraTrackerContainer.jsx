import React, { useEffect, useState } from "react";
import "./EraTrackerContainer.css";
import EraScore from "./EraScore";

// EraTrackerContainer component
const EraTrackerContainer = () => {
  const [eraScoreItems, setEraScoreItems] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  // Load EraScore data from JSON file
  useEffect(() => {
    fetch("/jsonFiles/EraScore.json")
      .then((res) => res.json())
      .then((data) => setEraScoreItems(data.EraScore || []));
  }, []);

  // Toggle collapse state
  const handleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <section className="era-tracker-container" aria-label="Era Tracker">
      <div className="era-tracker-header">
        <h2 className="era-tracker-title">Era Score Tracker</h2>
        <button
          className="era-tracker-collapse-btn"
          onClick={handleCollapse}
          aria-label={
            collapsed
              ? "Expand Era Score Tracker"
              : "Collapse Era Score Tracker"
          }
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {!collapsed && (
        <div className="era-score-list">
          {eraScoreItems.map((item) => (
            <EraScore key={item.title} {...item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default EraTrackerContainer;
