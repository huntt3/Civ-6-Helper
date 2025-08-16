import React from "react";

const DistrictDiscountingFormulaInputs = ({
  numSpecialtyDistrictsCompleted = 0,
  numSpecialtyDistrictsUnlocked = 0,
}) => {
  return (
    <section className="flex flex-row gap-8 items-center mb-6">
      <div className="flex flex-col items-start">
        <label className="text-sm font-semibold mb-1 w-24 leading-tight">
          Total Specialty Districts Completed
        </label>
        <div className="p-2 rounded-sm border border-gray-300 text-base w-24">
          {numSpecialtyDistrictsCompleted}
        </div>
      </div>
      <div className="flex flex-col items-start">
        <label className="text-sm font-semibold mb-1 w-24 leading-tight">
          Total Specialty Districts Unlocked
        </label>
        <div className="p-2 rounded-sm border border-gray-300 text-base w-24">
          {numSpecialtyDistrictsUnlocked}
        </div>
      </div>
    </section>
  );
};

export default DistrictDiscountingFormulaInputs;
