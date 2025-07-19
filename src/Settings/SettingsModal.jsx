import React from "react";
import "./Settings.css";
import EraDropdown from "./EraDropdown";
import VersionDropdown from "./VersionDropdown";
import CivModal from "../Templates/CivModal";
import Checkbox from "../Templates/Checkbox";

const SettingsModal = ({ open, setOpen }) => {
  const [heroesLegends, setHeroesLegends] = React.useState(false);
  const [monopoliesCorporations, setMonopoliesCorporations] =
    React.useState(false);
  const [removeLimitations, setRemoveLimitations] = React.useState(false);

  const message = (
    <div className="flex flex-col items-start space-y-2">
      <Checkbox
        label="Heroes & Legends"
        checked={heroesLegends}
        onChange={() => setHeroesLegends(!heroesLegends)}
      />
      <Checkbox
        label="Monopolies and Corporations"
        checked={monopoliesCorporations}
        onChange={() => setMonopoliesCorporations(!monopoliesCorporations)}
      />
      <Checkbox
        label="Remove All Limitations"
        checked={removeLimitations}
        onChange={() => setRemoveLimitations(!removeLimitations)}
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
