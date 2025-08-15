import React, { useState, useEffect } from "react";
import EraScoreModal from "./EraScoreModal";
import { FaStar } from "react-icons/fa";

const EraScore = ({
  title,
  eraScore,
  minEra,
  maxEra,
  description,
  repeatable,
  favorited = false,
  onToggleFavorite,
  onScoreChange,
  onNextEra,
}) => {
  const [showModal, setShowModal] = useState(false);
  // Track count for repeatable cards (default 0) and for non-repeatable (default 0 = unchecked)
  const [previousEraCount, setPreviousEraCount] = useState(0);
  const [currentEraCount, setCurrentEraCount] = useState(0);

  const handleModal = () => setShowModal((open) => !open);

  // Function to move current era values to previous eras
  const moveCurrentToPrevious = () => {
    if (currentEraCount > 0) {
      if (repeatable) {
        // For repeatable items, add current count to previous count
        setPreviousEraCount((prev) => prev + currentEraCount);
      } else {
        // For non-repeatable items, just move the checkbox state
        setPreviousEraCount(1);
      }
      // Reset current era count to 0
      setCurrentEraCount(0);
    }
  };

  // Register this function with the parent component
  useEffect(() => {
    if (onNextEra) {
      onNextEra(title, moveCurrentToPrevious);
    }
  }, [title, onNextEra, currentEraCount, repeatable]);

  // Update scores whenever counts change
  useEffect(() => {
    if (onScoreChange) {
      onScoreChange(title, "previous", previousEraCount * eraScore);
    }
  }, [previousEraCount, eraScore, title, onScoreChange]);

  useEffect(() => {
    if (onScoreChange) {
      onScoreChange(title, "current", currentEraCount * eraScore);
    }
  }, [currentEraCount, eraScore, title, onScoreChange]);

  // Handlers for repeatable count
  // Allow 0 as a valid value for repeatable count
  const handlePreviousEraCountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newCount = value === "" ? 0 : Math.max(0, parseInt(value, 10));
    setPreviousEraCount(newCount);
  };

  const handleCurrentEraCountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newCount = value === "" ? 0 : Math.max(0, parseInt(value, 10));
    setCurrentEraCount(newCount);
  };

  const handlePreviousEraToggle = () => {
    const newCount = previousEraCount === 0 ? 1 : 0;
    setPreviousEraCount(newCount);
  };

  const handleCurrentEraToggle = () => {
    const newCount = currentEraCount === 0 ? 1 : 0;
    setCurrentEraCount(newCount);
  };

  // Card container with Tailwind for background, border, shadow, spacing, and rounded corners
  return (
    <div className="flex items-center bg-white text-black rounded-lg p-4 shadow-md border border-gray-300 gap-4 mb-2 relative">
      {/* Favorite button with accessible label and no default button styling */}
      <button
        type="button"
        className="mr-2 focus:outline-none bg-transparent border-none p-0 cursor-pointer"
        aria-label={favorited ? "Unfavorite" : "Favorite"}
        onClick={onToggleFavorite}
        tabIndex={0}
      >
        <FaStar
          size={22}
          color={favorited ? "#FFD700" : "#A0AEC0"}
          aria-hidden="true"
        />
      </button>
      {repeatable ? (
        <div className="flex gap-4">
          <div className="flex flex-col items-start">
            <label
              htmlFor={`previous-era-count-${title}`}
              className="text-xs font-semibold mb-1"
            >
              Previous Eras
            </label>
            <input
              id={`previous-era-count-${title}`}
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              pattern="[0-9]+"
              value={previousEraCount}
              onChange={handlePreviousEraCountChange}
              className="p-2 rounded-sm border border-gray-300 text-base w-24"
              aria-label="Times completed in previous eras"
            />
          </div>
          <div className="flex flex-col items-start">
            <label
              htmlFor={`current-era-count-${title}`}
              className="text-xs font-semibold mb-1"
            >
              Current Era
            </label>
            <input
              id={`current-era-count-${title}`}
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              pattern="[0-9]+"
              value={currentEraCount}
              onChange={handleCurrentEraCountChange}
              className="p-2 rounded-sm border border-gray-300 text-base w-24"
              aria-label="Times completed in current era"
            />
          </div>
        </div>
      ) : (
        // For non-repeatable cards, show two checkboxes
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <label className="text-xs font-semibold mb-1">Previous Eras</label>
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600 border-gray-400 rounded focus:ring-2 focus:ring-blue-400"
              aria-label="Mark as completed in previous eras"
              checked={previousEraCount > 0}
              onChange={handlePreviousEraToggle}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-xs font-semibold mb-1">Current Era</label>
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600 border-gray-400 rounded focus:ring-2 focus:ring-blue-400"
              aria-label="Mark as completed in current era"
              checked={currentEraCount > 0}
              onChange={handleCurrentEraToggle}
            />
          </div>
        </div>
      )}
      <span className="text-lg font-medium mr-2">{title}</span>
      <span className="bg-gray-100 rounded px-2 py-1 mr-2 text-base">
        +{eraScore}
      </span>
      <button
        className="ml-auto bg-blue-700 text-white rounded px-3 py-2 text-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={handleModal}
        aria-label={`Show description for ${title}`}
      >
        Description
      </button>
      <EraScoreModal
        open={showModal}
        title={title}
        description={description}
        minEra={minEra}
        maxEra={maxEra}
        onClose={handleModal}
      />
    </div>
  );
};

export default EraScore;
