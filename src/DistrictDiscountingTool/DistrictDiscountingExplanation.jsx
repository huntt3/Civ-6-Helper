import React from "react";

const DistrictDiscountingExplanation = ({}) => (
  <div className="p-4 bg-blue-50 rounded-xl shadow-md border border-blue-200">
    <div className="mb-4 text-lg font-semibold text-blue-900">
      Districts are discounted when <span className="underline">both</span> of
      the following conditions are met:
    </div>
    <ul className="list-disc pl-6 space-y-4">
      <li>
        <div className="flex flex-row items-center gap-2 text-xl">
          <span className="font-mono font-bold text-blue-900">
            Specialty Districts Completed
          </span>
          <span className="mx-2 text-2xl font-bold text-blue-700">&#8805;</span>
          <span className="font-mono font-bold text-blue-900">
            Specialty Districts Unlocked
          </span>
        </div>
      </li>
      <li>
        <div className="flex flex-row items-center gap-2 text-xl">
          <span className="font-mono font-bold text-blue-900">
            Districts of Type Completed or Placed
          </span>
          <span className="mx-2 text-2xl font-bold text-blue-700">&lt;</span>
          <span className="flex flex-col items-center">
            <span className="font-mono font-bold text-blue-900 border-b-2 border-blue-700 px-2 pb-1">
              Specialty Districts Completed
            </span>
            <span className="font-mono font-bold text-blue-900 px-2 pt-1">
              Specialty Districts Unlocked
            </span>
          </span>
        </div>
      </li>
    </ul>
  </div>
);

export default DistrictDiscountingExplanation;
