import React, { useState, useEffect } from "react";
import "./App.css";
import SettingsButton from "./Settings/SettingsButton";
import EraTrackerContainer from "./EraScoreTracker/EraTrackerContainer";
import WondersContainer from "./WonderTracker/WondersContainer";
import TechTreeContainer from "./TechTree/TechTreeContainer";
import DistrictDiscountingContainer from "./DistrictDiscountingTool/DistrictDiscountingContainer";
import GreatPeopleContainer from "./GreatPeopleTracker/GreatPeopleContainer";
import Footer from "./Footer/Footer";
import axios from "axios";

const SETTINGS_KEY = "civ6-helper-settings";
const TECHS_KEY = "civ6-helper-techs";

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

  // Global state for TechsAndCivics
  const [techsAndCivics, setTechsAndCivics] = useState(() => {
    const saved = localStorage.getItem(TECHS_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Fetch from JSON if not in localStorage
  useEffect(() => {
    if (!techsAndCivics) {
      axios
        .get("/jsonFiles/TechsAndCivics.json")
        .then((res) => setTechsAndCivics(res.data))
        .catch(() => setTechsAndCivics({ Techs: [], Civics: [] }));
    }
  }, [techsAndCivics]);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (techsAndCivics) {
      localStorage.setItem(TECHS_KEY, JSON.stringify(techsAndCivics));
    }
  }, [techsAndCivics]);

  return (
    <main>
      <header className="App-header">
        <h1>Civ 6 Helper</h1>
      </header>
      <SettingsButton settings={settings} setSettings={setSettings} />
      <TechTreeContainer
        techsAndCivics={techsAndCivics}
        setTechsAndCivics={setTechsAndCivics}
      />
      <DistrictDiscountingContainer />
      <WondersContainer />
      <GreatPeopleContainer />
      <EraTrackerContainer settings={settings} setSettings={setSettings} />
      <Footer />
    </main>
  );
}

export default App;
