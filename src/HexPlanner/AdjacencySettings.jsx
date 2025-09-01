import React, { useState, useEffect } from "react";
import DraggablePanel from "../Templates/DraggablePanel";

/**
 * Component for adjacency settings specific to hex planner
 */
const AdjacencySettings = ({
  isVisible,
  onClose,
  settings,
  onSettingsChange,
  position,
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

  return (
    <DraggablePanel
      id="adjacency-settings"
      title="Adjacency Settings"
      isOpen={isVisible}
      onClose={onClose}
      position={position}
      maxWidth="320px"
    >
      <div className="space-y-3 max-h-80 overflow-y-auto">
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
                className="cursor-pointer font-medium text-gray-100 hover:text-blue-300 transition-colors"
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
    </DraggablePanel>
  );
};

export default AdjacencySettings;
