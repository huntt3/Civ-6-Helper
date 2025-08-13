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
  researched,
  setResearched,
  numberBuilt,
  setNumberBuilt,
  numSpecialtyDistrictsCompleted = 0,
  numSpecialtyDistrictsUnlocked = 0,
}) => {
  const imgFile = getDistrictImg(title);
  // Determine base cost
  let baseCost = 54;
  if (title === "Government Plaza" || title === "Diplomatic Quarter")
    baseCost = 30;
  // Calculate production cost
  const maxCompleted = Math.max(
    Number(techsCompleted) / 77 || 0,
    Number(civicsCompleted) / 61 || 0
  );
  let productionCost = (1 + 9 * maxCompleted) * baseCost;
  // Calculate discounted production cost
  let discountedProductionCost = "-";
  if (productionCost > 0) {
    if (title === "Government Plaza") {
      discountedProductionCost = Math.round(productionCost * 0.75);
    } else {
      discountedProductionCost = Math.round(productionCost * 0.6);
    }
  }

  // Calculate discount condition checkboxes
  const condition1 =
    numSpecialtyDistrictsCompleted >= numSpecialtyDistrictsUnlocked &&
    numSpecialtyDistrictsUnlocked > 0;
  let condition2 = false;
  if (numSpecialtyDistrictsUnlocked > 0) {
    condition2 =
      numberBuilt <
      numSpecialtyDistrictsCompleted / numSpecialtyDistrictsUnlocked;
  }
  const isDiscounted = condition1 && condition2;
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
          value={numberBuilt}
          onChange={(e) =>
            setNumberBuilt(Math.max(0, parseInt(e.target.value) || 0))
          }
          disabled={!researched}
        />
      </div>
      {/* Discounted status */}
      <div className="flex flex-col items-start mr-4 min-w-[110px]">
        <span
          className={`font-bold ${
            !researched
              ? "text-gray-500"
              : isDiscounted
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {!researched
            ? "Not Researched"
            : isDiscounted
            ? "Discounted"
            : "Not Discounted"}
        </span>
        {/* Discounting condition checkboxes */}
        <div className="flex flex-col gap-1 mt-2">
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={condition1}
              readOnly
              disabled
              className="w-3 h-3"
            />
            Completed ≥ Unlocked
          </label>
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={condition2}
              readOnly
              disabled
              className="w-3 h-3"
            />
            Built ≥ Completed/Unlocked
          </label>
        </div>
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
const DistrictCards = ({
  techsCompleted = 0,
  civicsCompleted = 0,
  researchedStates,
  setResearchedStates,
  numberBuiltStates,
  setNumberBuiltStates,
  numSpecialtyDistrictsCompleted = 0,
  numSpecialtyDistrictsUnlocked = 0,
}) => {
  return (
    <main
      className="flex flex-wrap gap-6 justify-center p-8"
      aria-label="District cards"
    >
      {districtTitles.map((title, idx) => (
        <DistrictCard
          key={title}
          title={title}
          discounted={false}
          techsCompleted={techsCompleted}
          civicsCompleted={civicsCompleted}
          researched={researchedStates[idx]}
          setResearched={(val) => {
            const updated = [...researchedStates];
            updated[idx] = val;
            setResearchedStates(updated);
          }}
          numberBuilt={numberBuiltStates[idx]}
          setNumberBuilt={(val) => {
            const updated = [...numberBuiltStates];
            updated[idx] = val;
            setNumberBuiltStates(updated);
          }}
          numSpecialtyDistrictsCompleted={numSpecialtyDistrictsCompleted}
          numSpecialtyDistrictsUnlocked={numSpecialtyDistrictsUnlocked}
        />
      ))}
    </main>
  );
};

export default DistrictCards;
