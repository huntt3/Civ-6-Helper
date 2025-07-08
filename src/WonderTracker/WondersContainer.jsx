import React, { useEffect, useState } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import "./WondersContainer.css";

// WonderCard component
// ...removed duplicate import of useEffect and useState...
// ...existing code...
const WonderCard = ({ wonder, onClick }) => {
  // Check if the requirement is researched
  const [isAvailable, setIsAvailable] = useState(false);
  useEffect(() => {
    // Check for changes in localStorage for tech/civic state
    const checkResearched = () => {
      let researched = false;
      const techState = JSON.parse(
        localStorage.getItem("civ6_tech_state") || "{}"
      );
      const civicState = JSON.parse(
        localStorage.getItem("civ6_civics_state") || "{}"
      );
      if (techState[wonder.requirement]?.researched) researched = true;
      if (civicState[wonder.requirement]?.researched) researched = true;
      setIsAvailable(researched);
    };
    checkResearched();
    // Listen for storage changes (from other tabs/windows)
    window.addEventListener("storage", checkResearched);
    // Listen for custom event when tech/civic state changes in this tab
    window.addEventListener("civ6_tech_civic_state_changed", checkResearched);
    return () => {
      window.removeEventListener("storage", checkResearched);
      window.removeEventListener(
        "civ6_tech_civic_state_changed",
        checkResearched
      );
    };
  }, [wonder.requirement]);

  // Add 'built' class if wonder.built is true, and 'available' if requirement is researched
  const cardClass = `wonder-card${wonder.built ? " built" : ""}${
    isAvailable ? " available" : ""
  }`;
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

// WondersContainer component using CollapsibleContainer
const WondersContainer = () => {
  const [wonders, setWonders] = useState([]);
  const [selectedWonder, setSelectedWonder] = useState(null);
  // Add collapsed state for CollapsibleContainer
  const [collapsed, setCollapsed] = useState(false);

  // Load wonders from JSON
  const fetchWonders = () => {
    fetch("/jsonFiles/Wonders.json")
      .then((res) => res.json())
      .then((data) => setWonders(data.Wonder || []))
      .catch(() => setWonders([]));
  };

  useEffect(() => {
    fetchWonders();
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

  // Collapse/expand handler
  const handleCollapse = () => setCollapsed((prev) => !prev);

  // Define the 8 eras in order
  const eraOrder = [
    "Ancient",
    "Classical",
    "Medieval",
    "Renaissance",
    "Industrial",
    "Modern",
    "Atomic",
    "Information",
  ];

  // Group wonders by era
  const wondersByEra = eraOrder.map((era) =>
    wonders.filter((w) => w.era === era)
  );

  return (
    <>
      <CollapsibleContainer
        title="Wonders"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        onRefresh={fetchWonders}
        ariaLabel="Wonders"
      >
        <div
          className="wonders-rows"
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {eraOrder.map((era, idx) => (
            <section key={era} aria-label={era} style={{ width: "100%" }}>
              <header style={{ marginBottom: "0.5rem" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    color: "var(--primary-text-color-dark)",
                  }}
                >
                  {era}
                </h3>
              </header>
              <div className="wonders-list" style={{ minHeight: "2.5rem" }}>
                {wondersByEra[idx].length === 0 ? (
                  <span style={{ color: "#888", fontSize: "0.95rem" }}>
                    No wonders
                  </span>
                ) : (
                  wondersByEra[idx].map((wonder) => (
                    <WonderCard
                      key={wonder.name}
                      wonder={wonder}
                      onClick={() => handleCardClick(wonder)}
                    />
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </CollapsibleContainer>
      <WonderModal
        wonder={selectedWonder}
        onClose={handleCloseModal}
        onToggleBuilt={handleToggleBuilt}
      />
    </>
  );
};

export default WondersContainer;
