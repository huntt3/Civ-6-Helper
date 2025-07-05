import React, { useEffect, useState } from "react";
import EraScore from "./EraScore";
import CollapsibleContainer from "./CollapsibleContainer";
import "./EraTrackerContainer.css";

// EraTrackerContainer component using CollapsibleContainer
const EraTrackerContainer = () => {
  const [eraScoreItems, setEraScoreItems] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  // Load EraScore data from JSON file
  const fetchEraScore = () => {
    fetch("/jsonFiles/EraScore.json")
      .then((res) => res.json())
      .then((data) => setEraScoreItems(data.EraScore || []))
      .catch(() => setEraScoreItems([]));
  };

  useEffect(() => {
    fetchEraScore();
  }, []);

  // Collapse/expand handler
  const handleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <CollapsibleContainer
      title="Era Score Tracker"
      collapsed={collapsed}
      onCollapse={handleCollapse}
      onRefresh={fetchEraScore}
      ariaLabel="Era Tracker"
    >
      <div className="era-score-list">
        {eraScoreItems.map((item) => (
          <EraScore key={item.title} {...item} />
        ))}
      </div>
    </CollapsibleContainer>
  );
};

export default EraTrackerContainer;
