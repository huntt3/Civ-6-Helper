import React from "react";
import "./EraTracker.css";

// EraScoreModal is a reusable modal for showing EraScore descriptions
const EraScoreModal = ({
  open,
  title,
  description,
  minEra,
  maxEra,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      className="era-score-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="era-score-modal-content">
        <h3 id="modal-title">{title}</h3>
        <p>{description}</p>
        <div className="era-score-era">
          {minEra} - {maxEra}
        </div>
        <button
          onClick={onClose}
          className="era-score-modal-close"
          aria-label="Close description"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EraScoreModal;
