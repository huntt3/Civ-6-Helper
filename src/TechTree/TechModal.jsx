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
          <strong>Cost:</strong>{" "}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25em",
            }}
          >
            {tech.baseCost}
            <img
              src={
                tech.techCivic === "Civic"
                  ? "public/yieldImg/culture.webp"
                  : "public/yieldImg/science.webp"
              }
              alt={tech.techCivic === "Civic" ? "culture" : "science"}
              style={{ height: "1em" }}
            />
          </span>
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
