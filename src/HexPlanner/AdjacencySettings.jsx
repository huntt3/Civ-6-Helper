import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

/**
 * Component for adjacency settings specific to hex planner
 */
const AdjacencySettings = ({
  isVisible,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const [adjacencySettings, setAdjacencySettings] = useState([]);
  const [activeSettings, setActiveSettings] = useState({});

  // Load adjacency settings data on component mount
  useEffect(() => {
    fetch("./jsonFiles/AdjacencySettings.json")
      .then((res) => res.json())
      .then((data) => {
        setAdjacencySettings(data.AdjacencySettings || []);
      })
      .catch(() => setAdjacencySettings([]));
  }, []);

  // Load active settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(
      "civ6-helper-hex-planner-adjacency-settings"
    );
    if (savedSettings) {
      setActiveSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save active settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem(
      "civ6-helper-hex-planner-adjacency-settings",
      JSON.stringify(activeSettings)
    );
    // Also pass to parent component
    if (onSettingsChange) {
      onSettingsChange(activeSettings);
    }
  }, [activeSettings, onSettingsChange]);

  const handleSettingToggle = (settingIndex, checked) => {
    setActiveSettings((prev) => ({
      ...prev,
      [settingIndex]: checked,
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-sm z-20 min-w-80 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-base">Adjacency Settings</h4>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white ml-2 p-1"
          aria-label="Close adjacency settings"
        >
          <FaTimes size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {adjacencySettings.map((setting, index) => (
          <div key={index} className="flex items-start space-x-3">
            <input
              type="checkbox"
              id={`setting-${index}`}
              checked={activeSettings[index] || false}
              onChange={(e) => handleSettingToggle(index, e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex-1">
              <label
                htmlFor={`setting-${index}`}
                className="cursor-pointer font-medium text-white hover:text-blue-300 transition-colors"
              >
                {setting.title}
              </label>
              <div className="text-xs text-gray-400 mt-1">
                {setting.adjacentTile && (
                  <span>
                    +1 adjacency for each {setting.adjacentTile} adjacent to{" "}
                    {setting.districtAffected}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {adjacencySettings.length === 0 && (
        <p className="text-gray-400 text-center py-4">
          Loading adjacency settings...
        </p>
      )}
    </div>
  );
};

export default AdjacencySettings;
