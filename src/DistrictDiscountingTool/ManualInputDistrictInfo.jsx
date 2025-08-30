import React from "react";

const totalPossibleTechs = 77;
const totalPossibleCivics = 61;

const ManualInputDistrictInfo = ({
  techsCompleted,
  setTechsCompleted,
  civicsCompleted,
  setCivicsCompleted,
  useCalculatedCounts = false,
}) => {
  return (
    <section className="flex flex-row gap-8 items-center mb-6">
      <div className="flex flex-col items-start">
        <label
          htmlFor="techs-completed"
          className="text-sm font-semibold mb-1 w-24 leading-tight break-words whitespace-normal"
        >
          Techs Completed
        </label>
        <input
          id="techs-completed"
          type="number"
          min="0"
          max={totalPossibleTechs}
          step="1"
          inputMode="numeric"
          pattern="[0-9]+"
          value={techsCompleted}
          onChange={(e) =>
            setTechsCompleted(Math.max(0, parseInt(e.target.value) || 0))
          }
          disabled={useCalculatedCounts}
          className={`p-2 rounded-sm border text-base w-24 ${
            useCalculatedCounts
              ? "border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
              : "border-gray-300"
          }`}
        />
        {useCalculatedCounts && (
          <div className="text-xs text-gray-500 mt-1 w-24 leading-tight">
            Auto-calculated from Tech Tree
          </div>
        )}
      </div>
      <div className="flex flex-col items-start">
        <label
          htmlFor="civics-completed"
          className="text-sm font-semibold mb-1 w-24 leading-tight break-words whitespace-normal"
        >
          Civics Completed
        </label>
        <input
          id="civics-completed"
          type="number"
          min="0"
          max={totalPossibleCivics}
          step="1"
          inputMode="numeric"
          pattern="[0-9]+"
          value={civicsCompleted}
          onChange={(e) =>
            setCivicsCompleted(Math.max(0, parseInt(e.target.value) || 0))
          }
          disabled={useCalculatedCounts}
          className={`p-2 rounded-sm border text-base w-24 ${
            useCalculatedCounts
              ? "border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
              : "border-gray-300"
          }`}
        />
        {useCalculatedCounts && (
          <div className="text-xs text-gray-500 mt-1 w-24 leading-tight">
            Auto-calculated from Civic Tree
          </div>
        )}
      </div>
    </section>
  );
};

export default ManualInputDistrictInfo;
