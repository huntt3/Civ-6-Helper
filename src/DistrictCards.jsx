import React from "react";
import "./DistrictCards.css";

// List of district titles
const districtTitles = [
  "Campus",
  "Theater Square",
  "Holy Site",
  "Encampment",
  "Commercial Hub",
  "Harbor",
  "Industrial Zone",
  "Preserve",
  "Entertainment Complex",
  "Water Park",
  "Aerodrome",
  "Spaceport",
  "Government Plaza",
  "Diplomatic Quarter",
];

// Functional component for a single card
const DistrictCard = ({ title }) => {
  return (
    <article className="district-card" aria-label={`${title} card`}>
      <header className="district-card-header">
        <h2>{title}</h2>
      </header>
      {/* Placeholder for image */}
      <div
        className="district-card-image"
        aria-label={`${title} image placeholder`}
        tabIndex="0"
      >
        {/* Add an <img> tag here when you have an image */}
      </div>
      <footer className="district-card-footer">
        <label htmlFor={`${title}-input`} className="visually-hidden">
          {`Input for ${title}`}
        </label>
        <input
          id={`${title}-input`}
          type="text"
          placeholder={`Enter info for ${title}`}
          aria-label={`Input for ${title}`}
        />
      </footer>
    </article>
  );
};

// Main component to render all cards
const DistrictCards = () => {
  return (
    <main className="district-cards-container" aria-label="District cards">
      {districtTitles.map((title) => (
        <DistrictCard key={title} title={title} />
      ))}
    </main>
  );
};

export default DistrictCards;
