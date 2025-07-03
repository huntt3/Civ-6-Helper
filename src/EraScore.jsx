import React from "react";
import "./EraScore.css";

// EraScore card component
const EraScore = ({ label }) => {
  return (
    <div className="era-score-card">
      <input type="checkbox" id={label} className="era-score-checkbox" />
      <label htmlFor={label} className="era-score-label">
        {label}
      </label>
    </div>
  );
};

export default EraScore;
