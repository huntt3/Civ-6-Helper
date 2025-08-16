import React, { useEffect, useState } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import WonderCard from "./WonderCard";
import WonderModal from "./WonderModal";

// WondersContainer component using CollapsibleContainer
const WondersContainer = () => {
  const [wonders, setWonders] = useState([]);
  const [selectedWonder, setSelectedWonder] = useState(null);
  // Add collapsed state for CollapsibleContainer
  const [collapsed, setCollapsed] = useState(true);

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
      {/* CollapsibleContainer wraps all wonders grouped by era */}
      <CollapsibleContainer
        title="Wonder Tracker"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        onRefresh={fetchWonders}
        ariaLabel="Wonders"
      >
        <div
          className="wonders-rows flex flex-col gap-6"
          /* Using Tailwind for layout, accessible structure */
        >
          {eraOrder.map((era) => (
            <section key={era} aria-label={era} className="w-full">
              <header className="mb-2">
                <h3
                  className="text-lg font-semibold"
                  style={{
                    margin: 0,
                    color: "var(--primary-text-color-dark)",
                  }}
                >
                  {era} Era
                </h3>
              </header>
              <div className="flex flex-wrap gap-4 justify-center">
                {wonders
                  .filter((w) => w.era === era)
                  .map((wonder) => (
                    <WonderCard
                      key={wonder.name}
                      wonder={wonder}
                      onClick={() => handleCardClick(wonder)}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </CollapsibleContainer>
      {/* WonderModal for showing details */}
      <WonderModal
        wonder={selectedWonder}
        onClose={handleCloseModal}
        onToggleBuilt={handleToggleBuilt}
      />
    </>
  );
};

export default WondersContainer;
