import React from "react";
import NextEraButton from "./NextEraButton";

const EraScoreSums = ({ previousEraScore, currentEraScore, onNextEra }) => {
  return (
    <div className="flex justify-center gap-8 mb-6 p-4 bg-gray-100 rounded-lg">
      <div className="flex flex-col items-center">
        <label className="text-sm font-semibold mb-1 text-gray-700">
          Era Score from Previous Eras
        </label>
        <div className="text-2xl font-bold text-blue-600 bg-white px-4 py-2 rounded border">
          {previousEraScore}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <label className="text-sm font-semibold mb-1 text-gray-700">
          Era Score from Current Era
        </label>
        <div className="text-2xl font-bold text-green-600 bg-white px-4 py-2 rounded border">
          {currentEraScore}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <NextEraButton onNextEra={onNextEra} />
      </div>
    </div>
  );
};

export default EraScoreSums;
