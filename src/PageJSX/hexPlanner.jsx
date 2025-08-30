import React, { useState, useEffect } from "react";
import "../App.css";
import Navbar from "../Navbar.jsx";
import SettingsButton from "../Settings/SettingsButton";
import HexPlannerContainer from "../HexPlanner/HexPlannerContainer";
import Footer from "../Footer/Footer";

const SETTINGS_KEY = "civ6-helper-settings";

function HexPlannerPage() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          heroesLegends: true,
          monopoliesCorporations: true,
        };
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <main>
      <Navbar />
      <SettingsButton settings={settings} setSettings={setSettings} />
      <HexPlannerContainer />
      <Footer />
    </main>
  );
}

export default HexPlannerPage;
