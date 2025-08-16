import React, { useState, useEffect } from "react";
import "../App.css";
import Navbar from "../Navbar.jsx";
import SettingsButton from "../Settings/SettingsButton";
import EraTrackerContainer from "../EraScoreTracker/EraTrackerContainer";
import Footer from "../Footer/Footer";

const SETTINGS_KEY = "civ6-helper-settings";

function EraScoreTrackerPage() {
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
      <Navbar />
      <SettingsButton settings={settings} setSettings={setSettings} />
      <EraTrackerContainer settings={settings} setSettings={setSettings} />
      <Footer />
    </main>
  );
}

export default EraScoreTrackerPage;
