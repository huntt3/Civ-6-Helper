import React from "react";

/**
 * Component for selecting tile types (terrain, feature, district, etc.)
 */
const TileTypeSelector = ({
  selectedFillType,
  onFillTypeChange,
  onFillItemChange,
}) => {
  const handleTypeChange = (type) => {
    onFillTypeChange(type);
    onFillItemChange(null); // Clear selected item when changing type
  };

  const tileTypes = [
    { key: "terrain", label: "Terrain" },
    { key: "feature", label: "Features" },
    { key: "district", label: "Districts" },
    { key: "wonder", label: "Wonders" },
    { key: "naturalWonder", label: "Natural Wonders" },
    { key: "tileImprovement", label: "Improvements" },
    { key: "river", label: "Rivers" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {tileTypes.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => handleTypeChange(key)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            selectedFillType === key
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TileTypeSelector;
