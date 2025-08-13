import React from "react";

const DistrictDiscountingExplanation = () => (
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
  </>
);

export default DistrictDiscountingExplanation;
