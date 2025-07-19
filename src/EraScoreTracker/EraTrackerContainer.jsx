import React, { useEffect, useState } from "react";
import EraScore from "./EraScore";
import ProgressBar from "./ProgressBar";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import SettingsModal from "../Settings/SettingsModal";
import "./EraTracker.css";

const EraTrackerContainer = () => {
  const [eraScoreItems, setEraScoreItems] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [settings, setSettings] = useState({
    heroesLegends: true,
    monopoliesCorporations: true,
  });
  const [showSettings, setShowSettings] = useState(false);

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
      <button
        className="mb-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowSettings(true)}
      >
        Settings
      </button>
      <SettingsModal
        open={showSettings}
        setOpen={setShowSettings}
        settings={settings}
        setSettings={setSettings}
      />
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
