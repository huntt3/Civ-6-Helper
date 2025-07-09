import React, { useEffect, useState } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import WonderCard from "./WonderCard";
import WonderModal from "./WonderModal";
import "./WonderTracker.css";

// WondersContainer component using CollapsibleContainer
const WondersContainer = () => {
  const [wonders, setWonders] = useState([]);
  const [selectedWonder, setSelectedWonder] = useState(null);
  // Add collapsed state for CollapsibleContainer
  const [collapsed, setCollapsed] = useState(false);

  // Load wonders from JSON
  const fetchWonders = () => {
    fetch("./jsonFiles/Wonders.json")
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
