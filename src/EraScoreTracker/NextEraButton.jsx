import React from "react";

const NextEraButton = ({ onNextEra }) => {
  return (
    <button
      onClick={onNextEra}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
      aria-label="Move current era scores to previous eras"
    >
      Next Era
    </button>
  );
};

export default NextEraButton;
