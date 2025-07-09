import React, { useEffect, useState } from "react";
import "./WonderTracker.css";

// Modal for Wonder details
const WonderModal = ({ wonder, onClose, onToggleBuilt }) => {
  if (!wonder) return null;
  return (
    <div
      className="wonder-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wonder-modal-title"
    >
      <div className="wonder-modal-content">
        <h3 id="wonder-modal-title">{wonder.name}</h3>
        <p>
          <strong>Requirement:</strong> {wonder.requirement}
        </p>
        <p>
          <strong>Era:</strong> {wonder.era}
        </p>
        <button
          className="wonder-built-btn"
          onClick={onToggleBuilt}
          aria-pressed={wonder.built}
        >
          {wonder.built ? "Built" : "Not Built"}
        </button>
        <button
          className="wonder-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WonderModal;
