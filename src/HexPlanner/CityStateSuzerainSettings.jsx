import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Component for city-state suzerain settings specific to hex planner
 */
const CityStateSuzerainSettings = ({
  isVisible,
  onClose,
  onSettingsChange,
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

  if (!isVisible) return null;

  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-sm z-20 min-w-64">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-base">City-State Suzerain</h4>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white ml-2 p-1"
          aria-label="Close city-state settings"
        >
          <FaTimes size={14} />
        </button>
      </div>

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
              className="cursor-pointer font-medium text-white hover:text-blue-300 transition-colors"
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
    </div>
  );
};

export default CityStateSuzerainSettings;
