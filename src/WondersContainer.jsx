import React, { useEffect, useState } from "react";
import "./WondersContainer.css";

// WonderCard component
const WonderCard = ({ wonder, onClick }) => {
  // Add 'built' class if wonder.built is true
  const cardClass = `wonder-card${wonder.built ? " built" : ""}`;
  return (
    <div
      className={cardClass}
      onClick={onClick}
      tabIndex={0}
      aria-label={`Show details for ${wonder.name}`}
    >
      <span className="wonder-card-title">{wonder.name}</span>
    </div>
  );
};

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

// WondersContainer component
const WondersContainer = () => {
  const [wonders, setWonders] = useState([]);
  const [selectedWonder, setSelectedWonder] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  // Load wonders from JSON
  useEffect(() => {
    fetch("/jsonFiles/Wonders.json")
      .then((res) => res.json())
      .then((data) => setWonders(data.Wonder || []));
  }, []);

  // Handle card click
  const handleCardClick = (wonder) => setSelectedWonder(wonder);

  // Handle modal close
  const handleCloseModal = () => setSelectedWonder(null);

  // Toggle built status
  const handleToggleBuilt = () => {
    setWonders((prev) =>
      prev.map((w) =>
        w.name === selectedWonder.name ? { ...w, built: !w.built } : w
      )
    );
    setSelectedWonder((prev) => prev && { ...prev, built: !prev.built });
  };

  // Toggle collapse state
  const handleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <section className="wonders-container" aria-label="Wonders">
      <div className="wonders-header">
        <h2 className="wonders-title">Wonders</h2>
        <button
          className="wonders-collapse-btn"
          onClick={handleCollapse}
          aria-label={collapsed ? "Expand Wonders" : "Collapse Wonders"}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {!collapsed && (
        <div className="wonders-list">
          {wonders.map((wonder) => (
            <WonderCard
              key={wonder.name}
              wonder={wonder}
              onClick={() => handleCardClick(wonder)}
            />
          ))}
        </div>
      )}
      <WonderModal
        wonder={selectedWonder}
        onClose={handleCloseModal}
        onToggleBuilt={handleToggleBuilt}
      />
    </section>
  );
};

export default WondersContainer;
