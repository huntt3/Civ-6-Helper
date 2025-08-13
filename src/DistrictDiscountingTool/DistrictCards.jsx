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
const DistrictCard = ({
  title,
  discounted = false,
  techsCompleted = 0,
  civicsCompleted = 0,
}) => {
  const imgFile = getDistrictImg(title);
  const [researched, setResearched] = React.useState(false);
  // Determine base cost
  let baseCost = 54;
  if (title === "Spaceport") baseCost = 1800;
  if (title === "Government Plaza" || title === "Diplomatic Quarter")
    baseCost = 30;
  // Calculate production cost
  const maxCompleted = Math.max(
    Number(techsCompleted) / 77 || 0,
    Number(civicsCompleted) / 61 || 0
  );
  let productionCost = 54;
  if (title === "Spaceport") {
    productionCost = baseCost;
  } else {
    productionCost = (1 + 9 * maxCompleted) * baseCost;
  }
  // Calculate discounted production cost
  let discountedProductionCost = "-";
  if (productionCost > 0) {
    if (title === "Government Plaza") {
      discountedProductionCost = Math.round(productionCost * 0.75);
    } else {
      discountedProductionCost = Math.round(productionCost * 0.6);
    }
  }
  return (
    <article
      className="bg-white rounded-md shadow-lg min-w-[400px] flex flex-row items-center m-2 border border-gray-200 p-2"
      aria-label={`${title} card`}
    >
      {/* Image on far left */}
      <div
        className="flex items-center justify-center rounded-sm mr-4"
        aria-label={`${title} image`}
        tabIndex="0"
        style={{ minWidth: "70px" }}
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
      {/* Researched checkbox */}
      <div className="flex flex-col items-center mr-4">
        <label
          htmlFor={`${title}-researched`}
          className="text-xs font-semibold mb-1"
        >
          Researched
        </label>
        <input
          id={`${title}-researched`}
          type="checkbox"
          checked={researched}
          onChange={(e) => setResearched(e.target.checked)}
          className="w-5 h-5 accent-green-600"
        />
      </div>
      {/* Number Built input */}
      <div className="flex flex-col items-start mr-4">
        <label
          htmlFor={`${title}-input`}
          className="text-xs font-semibold mb-1"
        >
          Number Built
        </label>
        <input
          id={`${title}-input`}
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          pattern="[0-9]+"
          placeholder={`Number Built`}
          aria-label={`Input for number of ${title} built`}
          className="p-2 rounded-sm border border-gray-300 text-base w-24"
        />
      </div>
      {/* Discounted status */}
      <div className="flex flex-col items-start mr-4 min-w-[110px]">
        <span
          className={`font-bold ${
            discounted ? "text-green-600" : "text-red-600"
          }`}
        >
          {discounted ? "Discounted" : "Not Discounted"}
        </span>
      </div>
      {/* Production Cost field */}
      <div className="flex flex-col items-start mr-4">
        <label className="text-xs font-semibold mb-1">Production Cost</label>
        <span className="p-2 rounded-sm border border-gray-300 text-base w-24 bg-gray-50">
          {productionCost > 0 ? Math.round(productionCost) : "-"}
        </span>
      </div>
      {/* Discounted Production Cost field */}
      <div className="flex flex-col items-start">
        <label className="text-xs font-semibold mb-1">
          Discounted Production Cost
        </label>
        <span className="p-2 rounded-sm border border-gray-300 text-base w-24 bg-gray-50">
          {discountedProductionCost}
        </span>
      </div>
    </article>
  );
};

// Main component to render all cards
const DistrictCards = ({ techsCompleted = 0, civicsCompleted = 0 }) => {
  return (
    <main
      className="flex flex-wrap gap-6 justify-center p-8"
      aria-label="District cards"
    >
      {districtTitles.map((title) => (
        <DistrictCard
          key={title}
          title={title}
          discounted={false}
          techsCompleted={techsCompleted}
          civicsCompleted={civicsCompleted}
        />
      ))}
    </main>
  );
};

export default DistrictCards;
