import React from "react";
import CivModal from "../Templates/CivModal";

// EraScoreModal uses CivModal for consistent modal styling and behavior
const EraScoreModal = ({
  open,
  title,
  description,
  minEra,
  maxEra,
  onClose,
}) => {
  // Create a wrapper function that properly handles the modal state
  const handleSetOpen = (shouldOpen) => {
    if (!shouldOpen) {
      onClose();
    }
  };

  // Compose the modal message
  return (
    <CivModal
      open={open}
      setOpen={handleSetOpen}
      title={title}
      message={
        <div className="text-center">
          <p className="mb-2">{description}</p>
          {(minEra != null || maxEra != null) && (
            <div className="text-base text-gray-600 mb-2">
              {minEra} - {maxEra}
            </div>
          )}
        </div>
      }
      confirmText="Close"
      onConfirm={() => {}}
    />
  );
};

export default EraScoreModal;
