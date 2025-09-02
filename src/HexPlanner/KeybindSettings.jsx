import React, { useState, useEffect } from "react";
import DraggablePanel from "../Templates/DraggablePanel";

/**
 * Component for keybind settings specific to hex planner
 */
const KeybindSettings = ({
  isVisible,
  onClose,
  onSettingsChange,
  position,
}) => {
  const [keybinds, setKeybinds] = useState({});
  const [tiles, setTiles] = useState([]);

  // Load tiles data to get default keybinds
  useEffect(() => {
    fetch("./jsonFiles/Tiles.json")
      .then((res) => res.json())
      .then((data) => {
        setTiles(data.Tiles || []);

        // Build default keybinds from tiles data
        const defaultKeybinds = {};
        data.Tiles?.forEach((tile) => {
          if (tile.keybind) {
            defaultKeybinds[tile.keybind] = {
              type: tile.type,
              name: tile.name,
            };
          }
        });

        // Load saved keybinds or use defaults
        const savedKeybinds = localStorage.getItem(
          "civ6-helper-hex-planner-keybinds"
        );
        if (savedKeybinds) {
          setKeybinds({ ...defaultKeybinds, ...JSON.parse(savedKeybinds) });
        } else {
          setKeybinds(defaultKeybinds);
        }
      })
      .catch(() => setTiles([]));
  }, []);

  // Save keybinds to localStorage when changed
  useEffect(() => {
    if (Object.keys(keybinds).length > 0) {
      localStorage.setItem(
        "civ6-helper-hex-planner-keybinds",
        JSON.stringify(keybinds)
      );
      if (onSettingsChange) {
        onSettingsChange(keybinds);
      }
    }
  }, [keybinds, onSettingsChange]);

  const handleKeybindChange = (oldKey, newKey) => {
    if (newKey && newKey !== oldKey) {
      setKeybinds((prev) => {
        const updated = { ...prev };
        const item = updated[oldKey];
        delete updated[oldKey];
        updated[newKey] = item;
        return updated;
      });
    }
  };

  const resetToDefaults = () => {
    const defaultKeybinds = {};
    tiles.forEach((tile) => {
      if (tile.keybind) {
        defaultKeybinds[tile.keybind] = {
          type: tile.type,
          name: tile.name,
        };
      }
    });
    setKeybinds(defaultKeybinds);
  };

  // Group keybinds by type for better organization
  const groupedKeybinds = Object.entries(keybinds).reduce(
    (acc, [key, item]) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push({ key, ...item });
      return acc;
    },
    {}
  );

  return (
    <DraggablePanel
      id="keybind-settings"
      title="Keybind Settings"
      isOpen={isVisible}
      onClose={onClose}
      position={position}
      maxWidth="350px"
    >
      <div className="space-y-4 max-h-80 overflow-y-auto">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-300">
            Press keys while hex planner is focused to quick-select tiles
          </p>
          <button
            onClick={resetToDefaults}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Reset to Defaults
          </button>
        </div>

        {Object.entries(groupedKeybinds).map(([type, items]) => (
          <div key={type} className="space-y-2">
            <h5 className="text-sm font-semibold text-gray-200 capitalize border-b border-gray-600 pb-1">
              {type === "special" ? "Special" : type.replace(/([A-Z])/g, " $1")}
            </h5>
            {items.map((item) => (
              <div
                key={`${item.key}-${item.name}`}
                className="flex items-center justify-between"
              >
                <span className="text-xs text-gray-300 flex-1">
                  {item.name}
                </span>
                <input
                  type="text"
                  value={item.key}
                  onChange={(e) =>
                    handleKeybindChange(item.key, e.target.value.toLowerCase())
                  }
                  maxLength={1}
                  className="w-8 h-6 text-center text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
            ))}
          </div>
        ))}

        {Object.keys(keybinds).length === 0 && (
          <p className="text-gray-400 text-center py-4 text-xs">
            Loading keybinds...
          </p>
        )}
      </div>
    </DraggablePanel>
  );
};

export default KeybindSettings;
