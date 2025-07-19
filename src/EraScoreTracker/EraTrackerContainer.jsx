import React, { useEffect, useState } from "react";
import EraScore from "./EraScore";
import ProgressBar from "./ProgressBar";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import "./EraTracker.css";

const EraTrackerContainer = ({ settings }) => {
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

  // Filter items based on settings and only include items with a title
  const safeSettings = settings || {
    heroesLegends: false,
    monopoliesCorporations: false,
  };
  const filteredItems = eraScoreItems.filter((item) => {
    if (!item.title) return false;
    if (
      item.gameMode === "Monopolies and Corporations" &&
      !safeSettings.monopoliesCorporations
    )
      return false;
    if (item.gameMode === "Heroes & Legends" && !safeSettings.heroesLegends)
      return false;
    return true;
  });

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
        {filteredItems.map((item) => (
          <EraScore key={item.title} {...item} />
        ))}
      </div>
    </CollapsibleContainer>
  );
};

export default EraTrackerContainer;
