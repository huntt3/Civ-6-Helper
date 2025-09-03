import React, { useState, useEffect } from "react";
import { getTileCategories } from "../utils/hexPlannerUtils";

/**
 * Component for selecting specific tile items based on the selected type
 */
const TileItemSelector = ({
  selectedFillType,
  selectedFillItem,
  onFillItemChange,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tile categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const tileCategories = await getTileCategories();
        setCategories(tileCategories);
      } catch (error) {
        console.error("Failed to load tile categories:", error);
        setCategories([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Get items based on selected type
  const getItems = () => {
    if (selectedFillType === "river") {
      // Return single river option for simplified UX
      return ["Rivers"];
    }

    const category = categories.find((cat) => cat.key === selectedFillType);
    return category ? category.items : [];
  };

  const items = getItems();

  // Don't render if no type is selected or still loading
  if (!selectedFillType || loading) {
    return loading ? (
      <div className="mt-4 text-center text-sm text-gray-500">
        Loading tiles...
      </div>
    ) : null;
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
