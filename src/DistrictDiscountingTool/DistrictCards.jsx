import React from "react";

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
    <article
      className="bg-white rounded-lg shadow-md w-[150px] flex flex-col items-stretch m-2 border border-gray-200"
      aria-label={`${title} card`}
    >
      <header className="bg-gray-100 rounded-t-lg p-4 text-center">
        {/* District image */}
        <div
          className="flex items-center justify-center m-4 rounded"
          aria-label={`${title} image`}
          tabIndex="0"
        >
          <img
            src={`./districtImg/${imgFile}.webp`}
            alt={`${title} district`}
            className="w-16 h-16 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.textContent = "No image available";
            }}
          />
        </div>
      </header>
      <footer className="p-4 flex flex-col">
        <label htmlFor={`${title}-input`} className="sr-only">
          {`Input for ${title}`}
        </label>
        <input
          id={`${title}-input`}
          type="text"
          placeholder={`Number Built`}
          aria-label={`Input for number of ${title} built`}
          className="p-2 rounded border border-gray-300 text-base"
        />
      </footer>
    </article>
  );
};

// Main component to render all cards
const DistrictCards = () => {
  return (
    <main
      className="flex flex-wrap gap-6 justify-center p-8"
      aria-label="District cards"
    >
      {districtTitles.map((title) => (
        <DistrictCard key={title} title={title} />
      ))}
    </main>
  );
};

export default DistrictCards;
