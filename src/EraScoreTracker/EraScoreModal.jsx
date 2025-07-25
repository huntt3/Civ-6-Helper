import React from "react";

// EraScoreModal is a reusable modal for showing EraScore descriptions
const EraScoreModal = ({
  open,
  title,
  description,
  minEra,
  maxEra,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg p-8 max-w-xs w-full shadow-2xl text-center">
        <h3 id="modal-title" className="text-xl font-semibold mb-2">
          {title}
        </h3>
        <p className="mb-2">{description}</p>
        {(minEra != null || maxEra != null) && (
          <div className="text-base text-gray-600 mb-2">
            {minEra} - {maxEra}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-700 text-white rounded px-4 py-2 text-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Close description"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EraScoreModal;
