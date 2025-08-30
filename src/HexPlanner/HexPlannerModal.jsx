import React, { useState, useEffect } from "react";
import {
  getTileCategories,
  getDefaultTile,
  validateTileConfiguration,
} from "../utils/hexPlannerUtils";

const HexPlannerModal = ({
  open,
  onClose,
  onTileSelect,
  selectedHex,
  currentTileData,
}) => {
  const [currentTile, setCurrentTile] = useState(getDefaultTile());
  const [activeCategory, setActiveCategory] = useState("terrain");
  const [validationErrors, setValidationErrors] = useState([]);

  // Load existing tile data when modal opens
  useEffect(() => {
    if (open && selectedHex) {
      // Load existing tile data if it exists, otherwise start with default
      if (currentTileData) {
        setCurrentTile(currentTileData);
      } else {
        setCurrentTile(getDefaultTile());
      }
    }
  }, [open, selectedHex, currentTileData]);

  // Validate current tile configuration
  useEffect(() => {
    const validation = validateTileConfiguration(currentTile);
    setValidationErrors(validation.errors);
  }, [currentTile]);

  const handleCategorySelect = (category, item) => {
    setCurrentTile((prev) => {
      const newTile = { ...prev };

      // Handle mutually exclusive logic
      if (category === "district" || category === "wonder") {
        // Clear feature if placing district/wonder
        newTile.feature = null;
        // Clear the other if placing one
        if (category === "district") newTile.wonder = null;
        if (category === "wonder") newTile.district = null;
      }

      if (category === "feature") {
        // Clear district/wonder if placing feature
        newTile.district = null;
        newTile.wonder = null;
      }

      // Set the selected item (or clear if clicking the same item)
      newTile[category] = newTile[category] === item ? null : item;

      return newTile;
    });
  };

  const handleRiverToggle = (edge) => {
    setCurrentTile((prev) => ({
      ...prev,
      hasRiverEdges: {
        ...prev.hasRiverEdges,
        [edge]: !prev.hasRiverEdges[edge],
      },
    }));
  };

  const handleApply = () => {
    const validation = validateTileConfiguration(currentTile);
    if (validation.isValid) {
      onTileSelect(selectedHex.id, currentTile);
      onClose();
    }
  };

  const handleClear = () => {
    setCurrentTile(getDefaultTile());
  };

  const categories = getTileCategories();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Configure Hex Tile</h2>
        <p className="mb-4 text-sm text-gray-600">
          Configure tile at position ({selectedHex?.coords?.q},{" "}
          {selectedHex?.coords?.r}):
        </p>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <h4 className="text-sm font-semibold text-red-800 mb-1">
              Configuration Issues:
            </h4>
            <ul className="text-sm text-red-700 list-disc list-inside">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 mb-4 border-b">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeCategory === category.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {category.name}
              {category.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </button>
          ))}
          <button
            onClick={() => setActiveCategory("rivers")}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeCategory === "rivers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            River Edges
          </button>
        </div>

        {/* Category Content */}
        <div className="mb-6 min-h-[200px]">
          {activeCategory === "rivers" ? (
            <div>
              <h3 className="text-md font-semibold mb-3">River Edges</h3>
              <p className="text-sm text-gray-600 mb-4">
                Toggle river edges around this hex. Adjacent tiles will
                automatically have matching river edges.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(currentTile.hasRiverEdges).map((edge) => (
                  <label
                    key={edge}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={currentTile.hasRiverEdges[edge]}
                      onChange={() => handleRiverToggle(edge)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm capitalize">
                      {edge.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            categories
              .filter((category) => category.key === activeCategory)
              .map((category) => (
                <div key={category.key}>
                  <h3 className="text-md font-semibold mb-2">
                    {category.name}
                    {category.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {category.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleCategorySelect(category.key, item)}
                        className={`p-3 text-left rounded border transition-colors ${
                          currentTile[category.key] === item
                            ? "bg-blue-100 border-blue-500 text-blue-900"
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium text-sm">{item}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Current Configuration Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h4 className="text-sm font-semibold mb-2">Current Configuration:</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>
              <strong>Terrain:</strong> {currentTile.terrain || "None selected"}
            </div>
            {currentTile.feature && (
              <div>
                <strong>Feature:</strong> {currentTile.feature}
              </div>
            )}
            {currentTile.district && (
              <div>
                <strong>District:</strong> {currentTile.district}
              </div>
            )}
            {currentTile.wonder && (
              <div>
                <strong>Wonder:</strong> {currentTile.wonder}
              </div>
            )}
            {currentTile.naturalWonder && (
              <div>
                <strong>Natural Wonder:</strong> {currentTile.naturalWonder}
              </div>
            )}
            {currentTile.tileImprovement && (
              <div>
                <strong>Tile Improvement:</strong> {currentTile.tileImprovement}
              </div>
            )}
            {Object.values(currentTile.hasRiverEdges).some(Boolean) && (
              <div>
                <strong>Rivers:</strong>{" "}
                {Object.entries(currentTile.hasRiverEdges)
                  .filter(([_, hasRiver]) => hasRiver)
                  .map(([edge]) => edge)
                  .join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={validationErrors.length > 0}
            className={`px-4 py-2 text-sm rounded ${
              validationErrors.length > 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default HexPlannerModal;
