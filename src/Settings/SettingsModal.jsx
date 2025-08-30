import React from "react";
import VersionDropdown from "./VersionDropdown";
import CivModal from "../Templates/CivModal";
import Checkbox from "../Templates/Checkbox";

const SettingsModal = ({ open, setOpen, settings, setSettings }) => {
  const handleCheckbox = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Default settings: Heroes & Legends and Monopolies and Corporations unchecked
  const defaultSettings = {
    version: "Gathering Storm",
    heroesLegends: false,
    monopoliesCorporations: false,
    babylonMode: false,
    removeLimitations: false,
  };

  const handleVersionChange = (version) => {
    setSettings((prev) => ({ ...prev, version }));
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
  };

  const message = (
    <div className="flex flex-col items-stretch space-y-2">
      <VersionDropdown
        selectedVersion={settings.version}
        onVersionChange={handleVersionChange}
      />
      <Checkbox
        label="Heroes & Legends"
        checked={settings.heroesLegends}
        onChange={() => handleCheckbox("heroesLegends")}
      />
      <Checkbox
        label="Monopolies and Corporations"
        checked={settings.monopoliesCorporations}
        onChange={() => handleCheckbox("monopoliesCorporations")}
      />
      <Checkbox
        label="Vanilla Babylon Mode"
        checked={settings.babylonMode}
        onChange={() => handleCheckbox("babylonMode")}
      />
      <Checkbox
        label="Remove All Limitations"
        checked={settings.removeLimitations}
        onChange={() => handleCheckbox("removeLimitations")}
      />
      <button
        className="bg-gray-300 text-gray-800 rounded px-4 py-1 mt-2 font-sans text-base hover:bg-gray-400 focus:bg-gray-400 focus:outline-none"
        type="button"
        aria-label="Reset to default settings"
        onClick={handleResetSettings}
      >
        Reset to Default
      </button>
    </div>
  );

  return (
    <CivModal
      open={open}
      setOpen={setOpen}
      title="Settings"
      message={message}
      confirmText="Save"
      cancelText="Close"
      onConfirm={() => setOpen(false)}
    />
  );
};

export default SettingsModal;
