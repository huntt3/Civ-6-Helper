import React, { useState, useEffect } from "react";
import DraggablePanel from "../Templates/DraggablePanel";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

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
  const [adjacencySettings, setAdjacencySettings] = useState({});
  const [activeSettings, setActiveSettings] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({});

  // Load adjacency settings data on component mount
  useEffect(() => {
    fetch("./jsonFiles/AdjacencySettings.json")
      .then((res) => res.json())
      .then((data) => {
        setAdjacencySettings(data.AdjacencySettings || {});
      })
      .catch(() => setAdjacencySettings({}));
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

  const handleSettingToggle = (settingKey, checked) => {
    setActiveSettings((prev) => ({
      ...prev,
      [settingKey]: checked,
    }));
  };

  const toggleSection = (sectionName) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  return (
    <DraggablePanel
      id="adjacency-settings"
      title="Adjacency Settings"
      isOpen={isVisible}
      onClose={onClose}
      position={position}
      maxWidth="380px"
    >
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {Object.entries(adjacencySettings).map(([sectionName, settings]) => (
          <div key={sectionName} className="border-b border-gray-600 pb-3">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(sectionName)}
              className="flex items-center justify-between w-full text-left mb-2 hover:text-blue-300 transition-colors"
            >
              <h4 className="text-sm font-semibold text-gray-200">
                {sectionName}
              </h4>
              {collapsedSections[sectionName] ? (
                <FaChevronRight className="w-3 h-3 text-gray-400" />
              ) : (
                <FaChevronDown className="w-3 h-3 text-gray-400" />
              )}
            </button>

            {/* Section Content */}
            {!collapsedSections[sectionName] && (
              <div className="space-y-2 ml-2">
                {settings.map((setting, index) => {
                  const settingKey = `${sectionName}-${index}`;
                  return (
                    <div
                      key={settingKey}
                      className="flex items-start space-x-3"
                    >
                      <input
                        type="checkbox"
                        id={`setting-${settingKey}`}
                        checked={activeSettings[settingKey] || false}
                        onChange={(e) =>
                          handleSettingToggle(settingKey, e.target.checked)
                        }
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`setting-${settingKey}`}
                          className="cursor-pointer font-medium text-gray-100 hover:text-blue-300 transition-colors text-sm"
                        >
                          {setting.title}
                        </label>
                        <div className="text-xs text-gray-400 mt-1">
                          {setting.multiplier && (
                            <span>
                              {setting.multiplier}x adjacency for{" "}
                              {setting.districtAffected}
                            </span>
                          )}
                          {setting.adjacentTile && (
                            <span>
                              +1 adjacency for each {setting.adjacentTile}{" "}
                              adjacent to {setting.districtAffected}
                            </span>
                          )}
                          {setting.additionalYield && (
                            <span>
                              +{setting.additionalYield.type} adjacency equal to{" "}
                              {setting.additionalYield.formula.replace(
                                "_",
                                " "
                              )}{" "}
                              for{" "}
                              {Array.isArray(setting.districtAffected)
                                ? setting.districtAffected.join(", ")
                                : setting.districtAffected}
                            </span>
                          )}
                          {setting.title === "River Goddess" && (
                            <span>
                              {settings?.version === "Better Balanced Game Mod"
                                ? "Holy Site adjacent to a River: +1 Faith adjacency, +1 Housing, +1 Amenities"
                                : "Holy Site adjacent to a River: +2 Housing, +2 Amenities"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(adjacencySettings).length === 0 && (
        <p className="text-gray-400 text-center py-4">
          Loading adjacency settings...
        </p>
      )}
    </DraggablePanel>
  );
};

export default AdjacencySettings;
