import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Navbar.jsx";
import SettingsButton from "./Settings/SettingsButton";
import EraTrackerContainer from "./EraScoreTracker/EraTrackerContainer";
import WondersContainer from "./WonderTracker/WondersContainer";
import TechTreeContainer from "./TechTree/TechTreeContainer";
import DistrictDiscountingContainer from "./DistrictDiscountingTool/DistrictDiscountingContainer";
import GreatPeopleContainer from "./GreatPeopleTracker/GreatPeopleContainer";
import HexPlannerContainer from "./HexPlanner/HexPlannerContainer";
import Footer from "./Footer/Footer";
import { calculateTechCivicCountsFromData } from "./utils/techCompletionUtils";
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
          version: "Gathering Storm",
          heroesLegends: false,
          monopoliesCorporations: false,
          babylonMode: false,
        };
  });

  // Global state for TechsAndCivics
  const [techsAndCivics, setTechsAndCivics] = useState(() => {
    const saved = localStorage.getItem(TECHS_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // State for calculated tech/civic completion counts from TechTreeContainer
  const [calculatedCounts, setCalculatedCounts] = useState({
    techsCompleted: 0,
    civicsCompleted: 0,
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

  // Calculate tech/civic completion counts from TechTreeContainer state
  useEffect(() => {
    const updateCounts = async () => {
      const counts = await calculateTechCivicCountsFromData();
      setCalculatedCounts(counts);
    };

    // Initial calculation
    updateCounts();

    // Listen for cross-tab storage changes
    const handleStorageChange = (e) => {
      if (e.key === "civ6_tech_state") {
        updateCounts();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Callback function for when tech state changes (with debouncing)
  const handleTechStateChange = React.useCallback(async () => {
    const counts = await calculateTechCivicCountsFromData();
    setCalculatedCounts(counts);
  }, []);

  return (
    <main>
      <Navbar />
      <SettingsButton settings={settings} setSettings={setSettings} />
      <TechTreeContainer
        techsAndCivics={techsAndCivics}
        setTechsAndCivics={setTechsAndCivics}
        settings={settings}
        onTechStateChange={handleTechStateChange}
      />
      <DistrictDiscountingContainer
        techsCompleted={calculatedCounts.techsCompleted}
        civicsCompleted={calculatedCounts.civicsCompleted}
        useCalculatedCounts={true}
      />
      <WondersContainer settings={settings} />
      <GreatPeopleContainer settings={settings} />
      <EraTrackerContainer settings={settings} setSettings={setSettings} />
      <HexPlannerContainer settings={settings} />
      <Footer />
    </main>
  );
}

export default App;
