import React, { useEffect, useState } from "react";
import "./WonderTracker.css";
import CivModal from "../Templates/CivModal";

// Modal for Wonder details
const WonderModal = ({ wonder, onClose, onToggleBuilt }) => {
  if (!wonder) return null;

  const message = `
    Requirement: ${wonder.requirement}
    Era: ${wonder.era}
  `;

  const confirmText = wonder.built ? "Mark as Not Built" : "Mark as Built";

  return (
    <CivModal
      open={!!wonder}
      setOpen={onClose}
      title={wonder.name}
      message={message}
      confirmText={confirmText}
      cancelText="Close"
      onConfirm={onToggleBuilt}
    />
  );
};

export default WonderModal;
