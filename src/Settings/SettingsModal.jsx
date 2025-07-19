import React from "react";
import EraDropdown from "./EraDropdown";
import VersionDropdown from "./VersionDropdown";
import CivModal from "../Templates/CivModal";
import Checkbox from "../Templates/Checkbox";

const SettingsModal = ({ open, setOpen, settings, setSettings }) => {
  const handleCheckbox = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const message = (
    <div className="flex flex-col items-start space-y-2">
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
        label="Remove All Limitations"
        checked={settings.removeLimitations}
        onChange={() => handleCheckbox("removeLimitations")}
      />
      <div className="flex justify-center items-center mt-4">
        <EraDropdown />
        <VersionDropdown />
      </div>
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
