import React, { useState, useEffect } from "react";
import DraggablePanel from "../Templates/DraggablePanel";

/**
 * Component for city-state suzerain settings specific to hex planner
 */
const CityStateSuzerainSettings = ({
  isVisible,
  onClose,
  onSettingsChange,
  position,
}) => {
  const [mexicoCitySuzerain, setMexicoCitySuzerain] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(
      "civ6-helper-hex-planner-citystate-settings"
    );
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setMexicoCitySuzerain(parsed.mexicoCitySuzerain || false);
    }
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    const settings = {
      mexicoCitySuzerain,
    };
    localStorage.setItem(
      "civ6-helper-hex-planner-citystate-settings",
      JSON.stringify(settings)
    );
    // Pass to parent component
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  }, [mexicoCitySuzerain, onSettingsChange]);

  const handleMexicoCityToggle = (checked) => {
    setMexicoCitySuzerain(checked);
  };

  return (
    <DraggablePanel
      id="citystate-settings"
      title="City-State Suzerain"
      isOpen={isVisible}
      onClose={onClose}
      position={position}
      maxWidth="280px"
    >
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="mexico-city-suzerain"
            checked={mexicoCitySuzerain}
            onChange={(e) => handleMexicoCityToggle(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <div className="flex-1">
            <label
              htmlFor="mexico-city-suzerain"
              className="cursor-pointer font-medium text-gray-100 hover:text-blue-300 transition-colors"
            >
              Mexico City suzerain
            </label>
            <div className="text-xs text-gray-400 mt-1">
              <span>
                +3 range for Industrial Zones, Entertainment Complexes, and
                Water Parks
              </span>
            </div>
          </div>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default CityStateSuzerainSettings;
