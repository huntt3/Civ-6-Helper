import React from "react";
import CivModal from "../Templates/CivModal";

const DistrictPlannerModal = ({ onClose }) => {
  return <CivModal confirmText="Close" onConfirm={() => onClose()} />;
};

export default DistrictPlannerModal;
