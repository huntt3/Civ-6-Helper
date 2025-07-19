import React, { useEffect, useState } from "react";
import EraScore from "./EraScore";
import ProgressBar from "./ProgressBar";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import "./EraTracker.css";

const EraTrackerContainer = () => {
  const [eraScoreItems, setEraScoreItems] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const fetchEraScore = () => {
    fetch("./jsonFiles/EraScore.json")
      .then((res) => res.json())
      .then((data) => setEraScoreItems(data.EraScore || []))
      .catch(() => setEraScoreItems([]));
  };

  useEffect(() => {
    fetchEraScore();
  }, []);

  const handleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <CollapsibleContainer
      title="Era Score Tracker"
      collapsed={collapsed}
      onCollapse={handleCollapse}
      onRefresh={fetchEraScore}
      ariaLabel="Era Tracker"
    >
      <ProgressBar />
      <div className="era-score-list">
        {eraScoreItems.map((item) => (
          <EraScore key={item.title} {...item} />
        ))}
      </div>
    </CollapsibleContainer>
  );
};

export default EraTrackerContainer;
