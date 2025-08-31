import React from "react";
import { getTileCategories } from "../utils/hexPlannerUtils";

/**
 * Component for selecting specific tile items based on the selected type
 */
const TileItemSelector = ({
  selectedFillType,
  selectedFillItem,
  onFillItemChange,
}) => {
  // Get items based on selected type using the utility function
  const getItems = () => {
    if (selectedFillType === "river") {
      // Return single river option for simplified UX
      return ["Rivers"];
    }

    const categories = getTileCategories();
    const category = categories.find((cat) => cat.key === selectedFillType);
    return category ? category.items : [];
  };
  const items = getItems();

  // Don't render if no type is selected
  if (!selectedFillType) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2 text-gray-800">
        {selectedFillType === "river"
          ? "River Tool - Click on hex edges to add/remove rivers"
          : `Select ${
              selectedFillType === "tileImprovement"
                ? "Tile Improvement"
                : selectedFillType === "naturalWonder"
                ? "Natural Wonder"
                : selectedFillType.charAt(0).toUpperCase() +
                  selectedFillType.slice(1)
            }:`}
      </h4>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-32 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onFillItemChange(item)}
            className={`p-2 text-xs rounded border transition-colors text-left ${
              selectedFillItem === item
                ? "bg-blue-100 border-blue-500 text-blue-900"
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs truncate">{item}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TileItemSelector;
