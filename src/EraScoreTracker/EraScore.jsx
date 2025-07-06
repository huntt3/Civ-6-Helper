import React, { useState } from "react";
import "./EraScore.css";

// EraScore card component
const EraScore = ({ title, eraScore, minEra, maxEra, description }) => {
  const [showModal, setShowModal] = useState(false);

  // Function to open/close modal
  const handleModal = () => setShowModal((open) => !open);

  return (
    <div className="era-score-card">
      {/* Checkbox */}
      <input type="checkbox" id={title} className="era-score-checkbox" />
      {/* Title */}
      <span className="era-score-title">{title}</span>
      {/* Era Score */}
      <span className="era-score-value">+{eraScore}</span>
      {/* Min/Max Era */}
      <span className="era-score-era">
        {minEra} - {maxEra}
      </span>
      {/* Description button */}
      <button
        className="era-score-desc-btn"
        onClick={handleModal}
        aria-label={`Show description for ${title}`}
      >
        Description
      </button>
      {/* Modal for description */}
      {showModal && (
        <div
          className="era-score-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="era-score-modal-content">
            <h3 id="modal-title">{title}</h3>
            <p>{description}</p>
            <button
              onClick={handleModal}
              className="era-score-modal-close"
              aria-label="Close description"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EraScore;
