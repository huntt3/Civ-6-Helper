import React, { useEffect, useState } from "react";
import CollapsibleContainer from "../Templates/CollapsibleContainer";
import WonderCard from "./WonderCard";
import WonderModal from "./WonderModal";

const WONDERS_BUILT_KEY = "civ6-helper-wonders-built";
const WONDERS_COLLAPSED_KEY = "civ6-helper-wonders-collapsed";

// WondersContainer component using CollapsibleContainer
const WondersContainer = () => {
  const [wonders, setWonders] = useState([]);
  const [selectedWonder, setSelectedWonder] = useState(null);
  // Add collapsed state for CollapsibleContainer with localStorage
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem(WONDERS_COLLAPSED_KEY);
    return saved ? JSON.parse(saved) : true;
  });
  // Track built wonders in localStorage
  const [wondersBuilt, setWondersBuilt] = useState(() => {
    const saved = localStorage.getItem(WONDERS_BUILT_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Save wonder built states to localStorage
  useEffect(() => {
    localStorage.setItem(WONDERS_BUILT_KEY, JSON.stringify(wondersBuilt));
  }, [wondersBuilt]);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(WONDERS_COLLAPSED_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  // Load wonders from JSON
  const fetchWonders = () => {
    fetch("./jsonFiles/Wonders.json")
      .then((res) => res.json())
      .then((data) => {
        const wondersData = data.Wonder || [];
        // Merge with built states from localStorage
        const wondersWithBuiltState = wondersData.map((wonder) => ({
          ...wonder,
          built: wondersBuilt[wonder.name] || false,
        }));
        setWonders(wondersWithBuiltState);
      })
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
    const newBuiltState = !selectedWonder.built;

    // Update wonder built state in localStorage
    setWondersBuilt((prev) => ({
      ...prev,
      [selectedWonder.name]: newBuiltState,
    }));

    // Update wonders state
    setWonders((prev) =>
      prev.map((w) =>
        w.name === selectedWonder.name ? { ...w, built: newBuiltState } : w
      )
    );

    // Update selected wonder
    setSelectedWonder((prev) => prev && { ...prev, built: newBuiltState });
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
        onRefresh={() => {
          // Reset built states, collapsed state, and refresh
          setWondersBuilt({});
          setCollapsed(true);
          localStorage.removeItem(WONDERS_BUILT_KEY);
          localStorage.removeItem(WONDERS_COLLAPSED_KEY);
          fetchWonders();
        }}
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
