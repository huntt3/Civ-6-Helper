import React, { useState, useEffect } from "react";
import "../App.css";
import Navbar from "../Navbar.jsx";
import SettingsButton from "../Settings/SettingsButton";
import TechTreeContainer from "../TechTree/TechTreeContainer";
import Footer from "../Footer/Footer";
import axios from "axios";

const SETTINGS_KEY = "civ6-helper-settings";
const TECHS_KEY = "civ6-helper-techs";

function TechsAndCivicsTreePage() {
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
      <Navbar />
      <SettingsButton settings={settings} setSettings={setSettings} />
      <TechTreeContainer
        techsAndCivics={techsAndCivics}
        setTechsAndCivics={setTechsAndCivics}
      />
      <Footer />
    </main>
  );
}

export default TechsAndCivicsTreePage;
