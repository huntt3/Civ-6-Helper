import React, { useState } from "react";
import "./EraTracker.css";

const EraScore = ({ title, eraScore, minEra, maxEra, description }) => {
  const [showModal, setShowModal] = useState(false);

  const handleModal = () => setShowModal((open) => !open);

  return (
    <div className="era-score-card">
      <input type="checkbox" id={title} className="era-score-checkbox" />
      <span className="era-score-title">{title}</span>
      <span className="era-score-value">+{eraScore}</span>
      <span className="era-score-era">
        {minEra} - {maxEra}
      </span>
      <button
        className="era-score-desc-btn"
        onClick={handleModal}
        aria-label={`Show description for ${title}`}
      >
        Description
      </button>
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
