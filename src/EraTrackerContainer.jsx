import React from "react";
import "./EraTrackerContainer.css";
import EraScore from "./EraScore";

// Example list of era score items
const eraScoreItems = [
  "Threatening Camp Destroyed",
  "Barbarian Camp Destroyed",
  "Tribal Village Contacted",
  "Final Foreign City Taken",
  "World's First to Meet All Civilizations",
  // Add more items as needed
];

// EraTrackerContainer component
// EraTrackerContainer component
const EraTrackerContainer = () => {
  return (
    <section className="era-tracker-container" aria-label="Era Tracker">
      <h2 className="era-tracker-title">Era Score Tracker</h2>
      <div className="era-score-list">
        {eraScoreItems.map((item) => (
          <EraScore key={item} label={item} />
        ))}
      </div>
    </section>
  );
};

export default EraTrackerContainer;
