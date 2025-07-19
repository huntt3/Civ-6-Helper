import React, { useState, useEffect } from "react";
import "./App.css";
import SettingsButton from "./Settings/SettingsButton";
import EraTrackerContainer from "./EraScoreTracker/EraTrackerContainer";
import WondersContainer from "./WonderTracker/WondersContainer";
import TechTreeContainer from "./TechTree/TechTreeContainer";
import DistrictDiscountingContainer from "./DistrictDiscountingTool/DistrictDiscountingContainer";
import GreatPeopleContainer from "./GreatPeopleTracker/GreatPeopleContainer";
import Footer from "./Footer/Footer";
import CivModal from "./Templates/CivModal";

const SETTINGS_KEY = "civ6-helper-settings";

// Main App component
function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          heroesLegends: true,
          monopoliesCorporations: true,
          removeLimitations: false,
        };
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <main>
      <header className="App-header">
        <h1>Civ 6 Helper</h1>
      </header>
      <SettingsButton settings={settings} setSettings={setSettings} />
      <TechTreeContainer />
      <DistrictDiscountingContainer />
      <WondersContainer />
      <GreatPeopleContainer />
      <EraTrackerContainer settings={settings} setSettings={setSettings} />
      <Footer />
    </main>
  );
}

export default App;
