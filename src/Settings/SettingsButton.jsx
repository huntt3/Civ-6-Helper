import React, { useState } from "react";
import SettingsModal from "./SettingsModal";
import settingsIcon from "/icons/settings.svg";

const SettingsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          if (!isModalOpen) setIsModalOpen(true);
        }}
        className="fixed bottom-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
        aria-label="Open Settings"
      >
        <img src={settingsIcon} alt="Settings" className="h-6 w-6" />
      </button>
      {isModalOpen && <SettingsModal open={true} setOpen={setIsModalOpen} />}
    </>
  );
};

export default SettingsButton;
