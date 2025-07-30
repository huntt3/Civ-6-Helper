import React from "react";
import CivModal from "../Templates/CivModal";

const TechModal = ({ tech, onClose }) => {
  if (!tech) return null;

  const message = `
    Cost: ${tech.baseCost} (${
    tech.techCivic === "Civic" ? "Culture" : "Science"
  })
    Boosted: ${tech.boosted ? "Yes" : "No"}
    Prerequisites: ${
      tech.prerequisites && tech.prerequisites.length > 0
        ? tech.prerequisites.join(", ")
        : "None"
    }
  `;

  return (
    <CivModal
      open={!!tech}
      setOpen={onClose}
      title={tech.name}
      message={message}
      confirmText="OK"
      cancelText="Close"
      onConfirm={() => onClose()}
    />
  );
};

export default TechModal;
