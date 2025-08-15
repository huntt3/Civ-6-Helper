import React, { useState } from "react";
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
}) => {
  const [showModal, setShowModal] = useState(false);
  // Track count for repeatable cards (default 0) and for non-repeatable (default 0 = unchecked)
  const [count, setCount] = useState(0);

  const handleModal = () => setShowModal((open) => !open);

  // Handlers for repeatable count
  // Allow 0 as a valid value for repeatable count
  const handleCountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCount(value === "" ? 0 : Math.max(0, parseInt(value, 10)));
  };
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => Math.max(0, c - 1));

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
        <div className="flex flex-col items-start">
          <label
            htmlFor={`repeatable-count-${title}`}
            className="text-xs font-semibold mb-1"
          >
            Times Completed
          </label>
          <input
            id={`repeatable-count-${title}`}
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            pattern="[0-9]+"
            value={count}
            onChange={handleCountChange}
            className="p-2 rounded-sm border border-gray-300 text-base w-24"
            aria-label="Times completed"
          />
        </div>
      ) : (
        // For non-repeatable cards, show a checkbox
        <input
          type="checkbox"
          className="mr-2 w-5 h-5 accent-blue-600 border-gray-400 rounded focus:ring-2 focus:ring-blue-400"
          aria-label="Mark as completed"
          checked={count > 0}
          onChange={() => setCount((c) => (c === 0 ? 1 : 0))}
        />
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
