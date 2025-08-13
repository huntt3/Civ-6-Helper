import React from "react";

const totalPossibleTechs = 77;
const totalPossibleCivics = 61;

const TechsAndCivicsPercentage = ({
  techsCompleted = 0,
  civicsCompleted = 0,
}) => {
  const techPercent =
    totalPossibleTechs > 0
      ? (Number(techsCompleted) / totalPossibleTechs) * 100
      : 0;
  const civicsPercent =
    totalPossibleCivics > 0
      ? (Number(civicsCompleted) / totalPossibleCivics) * 100
      : 0;
  // Highlight the higher percentage
  const techIsHigher = techPercent >= civicsPercent;
  return (
    <section className="flex flex-row gap-8 items-center mb-6">
      <div className="flex flex-col items-start">
        <label className="text-sm font-semibold mb-1">
          Percentage of Techs Completed
        </label>
        <div
          className={`text-base ${
            techIsHigher ? "text-green-600 font-bold text-xl" : "text-gray-700"
          }`}
        >
          {techPercent.toFixed(2)}%
        </div>
      </div>
      <div className="flex flex-col items-start">
        <label className="text-sm font-semibold mb-1">
          Percentage of Civics Completed
        </label>
        <div
          className={`text-base ${
            !techIsHigher ? "text-green-600 font-bold text-xl" : "text-gray-700"
          }`}
        >
          {civicsPercent.toFixed(2)}%
        </div>
      </div>
    </section>
  );
};

export default TechsAndCivicsPercentage;
