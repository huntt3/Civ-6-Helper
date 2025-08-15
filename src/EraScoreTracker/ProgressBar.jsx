import React, { useState, useEffect } from "react";

const NEEDED_ERA_SCORE_KEY = "civ6-helper-neededEraScore";

// Semicircular progress bar component
const ProgressBar = ({ eraScore = 0 }) => {
  // State for the denominator, initialized from localStorage
  const [neededEraScore, setNeededEraScore] = useState(() => {
    const saved = localStorage.getItem(NEEDED_ERA_SCORE_KEY);
    return saved !== null ? parseInt(saved, 10) : 18;
  });

  // Save to localStorage whenever neededEraScore changes
  useEffect(() => {
    localStorage.setItem(NEEDED_ERA_SCORE_KEY, neededEraScore);
  }, [neededEraScore]);

  // Calculate progress percentage (avoid division by zero)
  const progress =
    neededEraScore > 0 ? Math.min(eraScore / neededEraScore, 1) : 0;

  // Handle input change, only allow integers
  const handleNeededEraScoreChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setNeededEraScore(value === "" ? 0 : parseInt(value, 10));
  };

  // SVG arc calculation for semicircle
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = Math.PI * normalizedRadius;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center">
      {/* Semicircular SVG progress bar */}
      <svg
        width={radius * 2}
        height={radius + stroke}
        viewBox={`0 0 ${radius * 2} ${radius + stroke}`}
      >
        {/* Background arc */}
        <path
          d={`M ${
            stroke / 2
          },${radius} A ${normalizedRadius},${normalizedRadius} 0 0 1 ${
            radius * 2 - stroke / 2
          },${radius}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        {/* Progress arc */}
        <path
          d={`M ${
            stroke / 2
          },${radius} A ${normalizedRadius},${normalizedRadius} 0 0 1 ${
            radius * 2 - stroke / 2
          },${radius}`}
          fill="none"
          stroke="#2563eb"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
      </svg>
      {/* Display current era score and percentage */}
      <div className="text-center mt-2">
        <div className="text-2xl font-bold text-blue-600">
          {eraScore} / {neededEraScore}
        </div>
        <div className="text-sm text-gray-600">
          {Math.round(progress * 100)}% Complete
        </div>
      </div>

      {/* Inputs below the progress bar */}
      <form className="flex flex-col items-center mt-4 space-y-2">
        <label className="flex flex-col items-center">
          Needed Era Score
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={neededEraScore}
            onChange={handleNeededEraScoreChange}
            className="mt-1 p-1 border rounded w-24 text-center"
            aria-label="Needed Era Score"
          />
        </label>
      </form>
    </div>
  );
};

export default ProgressBar;
