import React from "react";
import CivModal from "../Templates/CivModal";

const TechModal = ({ tech, onClose }) => {
  if (!tech) return null;

  const message = [
    `Boosted: ${tech.boosted ? "Yes" : "No"}`,
    `Prerequisites: ${
      tech.prerequisites && tech.prerequisites.length > 0
        ? tech.prerequisites.join(", ")
        : "None"
    }`,
    `Boosted from element in one of the following: ${
      tech.boostPrerequisites && tech.boostPrerequisites.length > 0
        ? tech.boostPrerequisites.join(", ")
        : "None"
    }`,
  ].join("\n");

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
