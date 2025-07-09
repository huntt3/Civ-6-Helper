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

// Helper function to get the image file name from the title
const getDistrictImg = (title) => {
  // Remove spaces and make first character lowercase
  const noSpace = title.replace(/\s+/g, "");
  return noSpace.charAt(0).toLowerCase() + noSpace.slice(1);
};

// Functional component for a single card
const DistrictCard = ({ title }) => {
  const imgFile = getDistrictImg(title);
  return (
    <article className="district-card" aria-label={`${title} card`}>
      <header className="district-card-header">
        {/* District image */}
        <div
          className="district-card-image"
          aria-label={`${title} image`}
          tabIndex="0"
        >
          {/* The image path should be relative to the public folder for Vite/React */}
          <img
            src={`./districtImg/${imgFile}.webp`}
            alt={`${title} district`}
            className="district-img"
            onError={(e) => {
              // Show a simple fallback if image is missing
              e.target.style.display = "none";
              e.target.parentNode.textContent = "No image available";
            }}
          />
        </div>
      </header>
      <footer className="district-card-footer">
        <label htmlFor={`${title}-input`} className="visually-hidden">
          {`Input for ${title}`}
        </label>
        <input
          id={`${title}-input`}
          type="text"
          placeholder={`Number Built`}
          aria-label={`Input for number of ${title} built`}
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
