import React from "react";
import "./TechTree.css";

const TechModal = ({ tech, onClose }) => {
  if (!tech) return null;
  return (
    <div
      className="tech-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${tech.name}`}
    >
      <div className="tech-modal">
        <button
          className="tech-modal-close"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
        <div className="tech-modal-title">{tech.name}</div>
        <div className="tech-modal-section">
          <strong>Cost:</strong> {tech.baseCost}{" "}
          <img
            src="../../yieldImg/science.webp"
            alt="science"
            style={{ height: "1em", verticalAlign: "middle" }}
          />
        </div>
        <div className="tech-modal-section">
          <strong>Boosted:</strong> {tech.boosted ? "Yes" : "No"}
        </div>
        <div className="tech-modal-section">
          <strong>Prerequisites:</strong>
          <div className="tech-modal-prereqs">
            {tech.prerequisites && tech.prerequisites.length > 0 ? (
              <ul>
                {tech.prerequisites.map((pr, i) => (
                  <li key={i}>{pr}</li>
                ))}
              </ul>
            ) : (
              <span>None</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechModal;
