import React from "react";

const DistrictDiscountingExplanation = ({
  numSpecialtyDistrictsCompleted,
  numSpecialtyDistrictsUnlocked,
}) => (
  <>
    <div>
      Districts are discounted when both of the following conditions are met:
    </div>
    <div>
      The number of specialty districts completed &gt;= The number of specialty
      districts unlocked
    </div>
    <div>
      The number of districts of the type that have been completed or placed
      &lt; (The number of specialty districts completed / The number of
      specialty districts unlocked)
    </div>
    <div className="mt-4 font-bold text-blue-700">
      Total Specialty Districts Completed: {numSpecialtyDistrictsCompleted}
    </div>
    <div className="mb-2 font-bold text-blue-700">
      Total Specialty Districts Unlocked: {numSpecialtyDistrictsUnlocked}
    </div>
  </>
);

export default DistrictDiscountingExplanation;
