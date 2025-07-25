import React, { useState } from "react";
import EraScoreModal from "./EraScoreModal";
import { FaStar } from "react-icons/fa";
import "./EraTracker.css";

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

  return (
    <div className="era-score-card">
      <button
        type="button"
        className="mr-2 focus:outline-none"
        aria-label={favorited ? "Unfavorite" : "Favorite"}
        onClick={onToggleFavorite}
        tabIndex={0}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <FaStar
          size={22}
          color={favorited ? "#FFD700" : "#A0AEC0"}
          aria-hidden="true"
        />
      </button>
      {repeatable ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={decrement}
            aria-label="Decrease count"
          >
            -
          </button>
          <input
            type="text"
            value={count}
            onChange={handleCountChange}
            className="w-12 text-center border rounded"
            aria-label="Times completed"
          />
          <button
            type="button"
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={increment}
            aria-label="Increase count"
          >
            +
          </button>
        </div>
      ) : (
        // For non-repeatable cards, show a checkbox
        <input
          type="checkbox"
          className="era-score-checkbox"
          aria-label="Mark as completed"
          // For now, just local state
          checked={count > 0}
          onChange={() => setCount((c) => (c === 0 ? 1 : 0))}
          style={{ width: "1.2rem", height: "1.2rem" }}
        />
      )}
      <span className="era-score-title">{title}</span>
      <span className="era-score-value">+{eraScore}</span>
      <button
        className="era-score-desc-btn"
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
