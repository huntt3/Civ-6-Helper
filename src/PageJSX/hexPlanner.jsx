import React from "react";
import { createRoot } from "react-dom/client";
import DistrictPlannerContainer from "../HexPlanner/HexPlannerContainer.jsx";

const container = document.getElementById("hex-root");
const root = createRoot(container);
root.render(<DistrictPlannerContainer />);
